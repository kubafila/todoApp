const {
    Task,
    validate
} = require('../models/task');
const { taskToTag, taskToTagValidation } = require('../models/taskToTag');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/', async (req, res) => {
    const tasks = await Task.find().sort('name');
    res.send(tasks);
});

router.get('/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).send('The task with the given ID was not found.');

    res.send(task);
});

router.post('/', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let task = new Task({
        name: req.body.name,
        isDone: req.body.isDone,
    });
    task = await task.save();

    res.send(task);
});

router.put('/:id', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const task = await Task.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isDone: req.body.isDone
    }, {
        new: true
    });

    if (!task) return res.status(404).send('The task with the given ID was not found.');

    res.send(task);
});

router.delete('/:id', async (req, res) => {
    const task = await Task.findByIdAndRemove(req.params.id);

    if (!task) return res.status(404).send('The task with the given ID was not found.');

    res.send(task);
});

// 
// relation tag - task
// /api/tasks 

router.get('/:id/tags', async (req, res) => {
    taskToTag.find({'task': mongoose.Types.ObjectId(req.params.id)})
        .populate('tag')
        .exec()
        .then( docs => {
            const tags = docs.map(doc => {
                return doc.tag;
            })
            res.send(tags);
    })
});

router.delete('/:taskId/tags/:tagId', async (req, res) => {
    const relation = await taskToTag.findOneAndDelete({'task': req.params.taskId, 'tag': req.params.tagId})
    if(!relation) return res.status(404).send('The task with the given ID was not found.')
    res.send(relation);
})

router.post('/:taskId/tags/:tagId', async (req, res) => {
    const { error } = taskToTagValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let relation = new taskToTag({
        task: req.params.taskId,
        tag: req.params.tagId
    });
    
})
module.exports = router;