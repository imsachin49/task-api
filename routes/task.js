const express=require('express');
const router=express.Router();
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTaskById,
    deleteTaskById
}=require('../controllers/task');
const {verifyToken}=require('../middleware/verify');

// Create Task
router.post('/create',verifyToken,createTask);

// Get all tasks of logged in user
router.get('/all',verifyToken,getAllTasks);

// Get task by id
router.get('/:id',verifyToken,getTaskById);

// Update task by id
router.put('/:id',verifyToken,updateTaskById);

// Delete task by id
router.delete('/:id',verifyToken,deleteTaskById);

module.exports=router;
