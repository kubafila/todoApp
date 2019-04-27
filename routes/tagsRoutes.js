const {Tag, validateTag} = require('../models/tag');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const tags = await Tag.find().sort('name');
    res.send(tags);
})

router.get('/:id', async (req, res) => {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).send('The tag with the given ID was not found.');
    else res.send(tag);
})

router.post('/', async (req, res) => {
    const { error } = validateTag(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let tag = new Tag({
        name: req.body.name,
        color: req.body.color
    });
    tag = await tag.save();

    res.send(tag);
});

router.put('/:id', async (req, res) => {
    const {error} = validateTag(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const tag= await Tag.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        color: req.body.color
    }, {
        new: true
    });

    if (!tag) return res.status(404).send('The tag with the given ID was not found.');

    res.send(tag);
});

router.delete('/:id', async (req, res) => {
    const tag = await Tag.findByIdAndRemove(req.params.id);

    if (!tag) return res.status(404).send('The tag with the given ID was not found.');

    res.send(tag);
});


// 
// relation tag - task
// /api/tasks 

router.get('/:id/tasks', async (req, res) => {
    taskToTag.find({'tag': mongoose.Types.ObjectId(req.params.id)})
        .populate('task')
        .exec()
        .then( docs => {
            const tags = docs.map(doc => {
                return doc.task;
            })
            res.send(tags);
    })
});

router.delete('/:tagId/tasks/:taskId', async (req, res) => {
    const relation = await taskToTag.findOneAndDelete(
        {
            'task': mongoose.Types.ObjectId(req.params.taskId), 
            'tag': mongoose.Types.ObjectId(req.params.tagId)
        }
    )
    if(!relation) return res.status(404).send('Relation between given IDs is not found')
    res.send(relation);
});

router.post('/:tagId/tasks/:taskId', async (req, res) => {
    const { error } = taskToTagValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let relation = new taskToTag({
        task: mongoose.Types.ObjectId(req.params.taskId),
        tag: mongoose.Types.ObjectId(req.params.tagId)
    });
    relation = await relation.save();

    res.send(relation);
});
module.exports = router;