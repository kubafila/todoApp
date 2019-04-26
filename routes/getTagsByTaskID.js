const { taskToTag } = require('../models/taskToTag');
const express = require('express');
const mongoose = require('mongoose');
const {Tag} = require('../models/tag') 
const router = express.Router();

router.get('/:id', async (req, res) => {
    const tasksToTagsDocuments = await taskToTag.find({'taskID': mongoose.Types.ObjectId(req.params.id)});
    if (!tasksToTagsDocuments[0]) return res.status(404).send('This task is not associated with any tag');
    console.log(tasksToTagsDocuments[0])
    const tagsDocuments = await Tag.findById(/*mongoose.Types.ObjectId(tasksToTagsDocuments[0].tagID*/ mongoose.Types.ObjectId('5cc2b244d1aafa2d0c2351e0'));
    res.send(tagsDocuments);
    // const tags = await Tag.findById(mongoose.Types.ObjectId(tasksToTagsDocuments.tagID))
});

// router.get('/:id', async (req, res) => {
//     const tasksToTagsDocuments = await tasksToTags.find().sort('_id');
//     res.send(tasksToTagsDocuments[0]);
//     if (!tasksToTagsDocuments) return res.status(404).send('This task is not associated with any tag');
//     const tags = await Tag.findById(mongoose.Types.ObjectId(tasksToTagsDocuments.tagID))
// });

module.exports = router;