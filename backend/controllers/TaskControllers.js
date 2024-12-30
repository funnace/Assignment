const Task = require('../models/TaskSchema')

 const getTasks = async (req, res) => {
    const { priority, status, sortBy, order, page = 1, limit = 10 } = req.query;
    const filter = { userId: req.user.userId };
    if (priority) filter.priority = priority;
    if (status) filter.status = status;
  
    const tasks = await Task.find(filter)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(tasks);
  }
   const postTask = async (req, res) => {
    const { title, startTime, endTime, priority, status } = req.body;
    console.log(title, startTime, endTime, priority, status, req.user.userId)
  
    try {
      const task = new Task({
        title,
        startTime,
        endTime,
        priority,
        status,
        userId: req.user.userId,
      });
      await task.save();
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ message: 'Error creating task', error: err.message });
    }
  }

   const editTasks = async (req, res) => {
    const { id } = req.params;
    const { title, startTime, endTime, priority, status } = req.body;
  
    try {
      const task = await Task.findOneAndUpdate(
        { _id: id, userId: req.user.userId },
        { title, startTime, endTime, priority, status },
        { new: true }
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: 'Error updating task', error: err.message });
    }
  }
  
  const deleteTasks = async (req, res) => {
    const { ids } = req.body;  // Retrieve the array of task IDs from the request body
  
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No task IDs provided' });
    }
  
    try {
      const deletedTasks = await Task.deleteMany({
        _id: { $in: ids },
        userId: req.user.userId,  // Ensure that the user is authorized
      });
  
      if (deletedTasks.deletedCount === 0) {
        return res.status(404).json({ message: 'No tasks found for deletion' });
      }
  
      res.json({ message: 'Tasks deleted successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Error deleting tasks', error: err.message });
    }
  };  

  module.exports = {
    getTasks,
    postTask,
    editTasks,
    deleteTasks
};