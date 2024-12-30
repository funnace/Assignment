const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    priority: { type: Number, min: 1, max: 5, required: true },
    status: { type: String, enum: ['Pending', 'Finished'], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator', required: true },
});

// Export the Task model using module.exports
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;