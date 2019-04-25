const Joi = require('joi');
const mongoose = require('mongoose');

const taskToTag = mongoose.model('taskToTag', new mongoose.Schema({
    task: {
        type: String,
    },
    tag: {
        type: Boolean,
    }
}, {collection: 'taskToTag'}));

function validateTaskToTag(taskToTag) {
    const schema = {
        task: Joi.string(),
        tag: Joi.string()
    };

    return Joi.validate(taskToTag, schema);
}

exports.taskToTag = taskToTag;
exports.validate = validateTaskToTag;