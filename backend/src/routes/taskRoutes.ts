import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

const router = Router();
const taskController = new TaskController();

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:taskId', taskController.getTask);
router.post('/:taskId/execute', taskController.executeTask);

// Export the router
export default router;
