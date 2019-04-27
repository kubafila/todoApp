const Joi = require('joi');
const mongoose = require('mongoose');

const Tag = mongoose.model('Tag', mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    color: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 35
    }
}));

function validateTag(tag) {
    const schema = {
        name: Joi.string().min(1).max(255).required(),
        color: Joi.string().min(1).max(35).required(),
    };

    return Joi.validate(tag, schema);
}

exports.Tag = Tag;
exports.validateTag = validateTag;