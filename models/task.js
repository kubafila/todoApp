const Joi = require('joi');
const mongoose = require('mongoose');

const Task = mongoose.model('Task', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255
    },
    isDone: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}));

function validateTask(task) {
    const schema = {
        name: Joi.string().min(4).max(255).required(),
        isDone: Joi.boolean(),
        userId: Joi.required()
    };

    return Joi.validate(task, schema);
}

exports.Task = Task;
exports.validate = validateTask;