import { Request, Response } from 'express';
import { Task, ITask } from '../models/Task';
import { TaskPlanner } from '../services/taskPlanner';

export class TaskController {
  private taskPlanner: TaskPlanner;

  constructor() {
    this.taskPlanner = new TaskPlanner();
  }

  createTask = async (req: Request, res: Response) => {
    try {
      const { description, cost } = req.body;

      if (!description) {
        return res.status(400).json({ error: 'Description is required' });
      }

      const task = await Task.create({
        description,
        cost: parseFloat(cost) || 0,
        status: 'pending',
        paymentStatus: 'pending',
        steps: []
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  };

  getAllTasks = async (_req: Request, res: Response) => {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  };

  getTask = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  };

  executeTask = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.params.taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Plan task steps if not already planned
      if (!task.steps || task.steps.length === 0) {
        task.steps = await this.taskPlanner.planTask(task.description);
        task.status = 'planning';
        await task.save();
      }

      // Start execution
      task.status = 'executing';
      await task.save();

      // Send initial response
      res.json(task);

      // Execute steps asynchronously
      this.executeStepsAsync(task);

    } catch (error) {
      console.error('Error executing task:', error);
      res.status(500).json({ error: 'Failed to execute task' });
    }
  };

  private executeStepsAsync = async (task: ITask) => {
    try {
      // Execute all steps
      const results = await this.taskPlanner.executeSteps(task.steps);
      
      // Update task with results
      task.steps = results;
      task.status = 'completed';
      await task.save();
    } catch (error) {
      console.error('Error in async execution:', error);
      task.status = 'failed';
      await task.save();
    }
  };
}
