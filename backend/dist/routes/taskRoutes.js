"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = require("../controllers/taskController");
const router = (0, express_1.Router)();
const taskController = new taskController_1.TaskController();
// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/:taskId', taskController.getTask);
router.post('/:taskId/execute', taskController.executeTask);
// Export the router
exports.default = router;
