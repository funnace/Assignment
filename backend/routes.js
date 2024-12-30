const express = require('express');
const { getTasks, postTask, editTasks, deleteTask } = require("./controllers/TaskControllers");
const { register, login } = require("./controllers/UserController");
const { authenticate } = require("./middleware/auth");

const router = express.Router();

router.use(express.json()); 

router.post('/register', register);
  
router.post('/login', login);
  
router.get('/tasks', authenticate, getTasks);
  
router.post('/tasks', authenticate, postTask);
  
router.put('/tasks/:id', authenticate, editTasks);
  
router.delete('/tasks/:id', authenticate, deleteTask);

module.exports = router;