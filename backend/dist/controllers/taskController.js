"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const Task_1 = require("../models/Task");
const taskPlanner_1 = require("../services/taskPlanner");
class TaskController {
    constructor() {
        this.createTask = async (req, res) => {
            try {
                const { description, cost } = req.body;
                if (!description) {
                    return res.status(400).json({ error: 'Description is required' });
                }
                const task = await Task_1.Task.create({
                    description,
                    cost: parseFloat(cost) || 0,
                    status: 'pending',
                    paymentStatus: 'pending',
                    steps: []
                });
                res.status(201).json(task);
            }
            catch (error) {
                console.error('Error creating task:', error);
                res.status(500).json({ error: 'Failed to create task' });
            }
        };
        this.getAllTasks = async (_req, res) => {
            try {
                const tasks = await Task_1.Task.find().sort({ createdAt: -1 });
                res.json(tasks);
            }
            catch (error) {
                console.error('Error fetching tasks:', error);
                res.status(500).json({ error: 'Failed to fetch tasks' });
            }
        };
        this.getTask = async (req, res) => {
            try {
                const task = await Task_1.Task.findById(req.params.taskId);
                if (!task) {
                    return res.status(404).json({ error: 'Task not found' });
                }
                res.json(task);
            }
            catch (error) {
                console.error('Error fetching task:', error);
                res.status(500).json({ error: 'Failed to fetch task' });
            }
        };
        this.executeTask = async (req, res) => {
            try {
                const task = await Task_1.Task.findById(req.params.taskId);
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
            }
            catch (error) {
                console.error('Error executing task:', error);
                res.status(500).json({ error: 'Failed to execute task' });
            }
        };
        this.executeStepsAsync = async (task) => {
            try {
                // Execute all steps
                const results = await this.taskPlanner.executeSteps(task.steps);
                // Update task with results
                task.steps = results;
                task.status = 'completed';
                await task.save();
            }
            catch (error) {
                console.error('Error in async execution:', error);
                task.status = 'failed';
                await task.save();
            }
        };
        this.taskPlanner = new taskPlanner_1.TaskPlanner();
    }
}
exports.TaskController = TaskController;
