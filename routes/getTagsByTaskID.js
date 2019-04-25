const { taskToTag } = require('../models/taskToTag');
const express = require('express');
// const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
    const tasksToTags = await taskToTag.find().sort('tagID');
    res.send(tasksToTags);
    // if (!tasksToTagsDocuments) return res.status(404).send('This task is not associated with any tag');
    // const tags = await Tag.findById(mongoose.Types.ObjectId(tasksToTagsDocuments.tagID))
});

// router.get('/:id', async (req, res) => {
//     const tasksToTagsDocuments = await tasksToTags.find().sort('_id');
//     res.send(tasksToTagsDocuments[0]);
//     if (!tasksToTagsDocuments) return res.status(404).send('This task is not associated with any tag');
//     const tags = await Tag.findById(mongoose.Types.ObjectId(tasksToTagsDocuments.tagID))
// });

module.exports = router;