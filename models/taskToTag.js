const Joi = require('joi');
const mongoose = require('mongoose');

const taskToTag = mongoose.model('taskToTag', new mongoose.Schema({
    task: {
        type: mongoose.Types.ObjectId,
        ref: 'Task',
        require: true
    },
    tag: {
        type: mongoose.Types.ObjectId,
        ref: 'Tag',
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {collection: 'taskToTag'}));

function validateTaskToTag(taskToTag) {
    const schema = {
        task: Joi.string().required(),
        tag: Joi.string().required(),
        userId: Joi.required()
    };

    return Joi.validate(taskToTag, schema);
}

exports.taskToTag = taskToTag;
exports.taskToTagValidation = validateTaskToTag;