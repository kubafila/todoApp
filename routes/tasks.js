const {
    Task,
    validate
} = require('../models/task');
const express = require('express');
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

module.exports = router;