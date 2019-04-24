const mongoose = require('mongoose');

const TagToTask = mongoose.model('TagToTask', new mongoose.Schema({
    tagID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    taskID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}));

exports.Task = Task;
exports.validate = validateTask;