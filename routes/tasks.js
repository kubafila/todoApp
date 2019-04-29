const {
    Task,
    validate
} = require('../models/task');
const { taskToTag, taskToTagValidation } = require('../models/taskToTag');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', async (req, res) => {
    let tasks;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        tasks = await Task.find({userId: decoded._id}).sort('name');
        res.send(tasks);
    });
});

router.get('/:id', async (req, res) => {
    
    let task;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        task = await Task.findOne({_id: mongoose.Types.ObjectId(req.params.id), userId: decoded._id}).sort('name');
    });
    if (!task) return res.status(404).send('The task with the given ID was not found.');
    res.send(task);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let task;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), function(err, decoded) {
        task = new Task({
            name: req.body.name,
            isDone: req.body.isDone,
            userId: decoded._id
        });
    });
    
    task = await task.save();

    res.send(task);
});

router.put('/:id', async (req, res) => {
    const {
        error
    } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let task;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        task = await Task.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(req.params.id),
            userId: mongoose.Types.ObjectId(decoded._id)
        }, {
            name: req.body.name,
            isDone: req.body.isDone,
            userId: decoded._id
        }, {
            new: true
        });

        if (!task) return res.status(404).send('The task with the given ID was not found.');

        res.send(task);
    });
});


router.delete('/:id', async (req, res) => {
    let task;
    
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        task = await Task.findOneAndDelete(
            {
                _id: mongoose.Types.ObjectId(req.params.id),
                 userId: decoded._id
            }
        ).sort('name');
        res.send(tasks);
    });

    if (!task) return res.status(404).send('The task with the given ID was not found.');
    else while(await taskToTag.findOneAndDelete(
        {
            task: mongoose.Types.ObjectId(req.params.id)
        }
    ));

    res.send(task);
});

// 
// relation tag - task
// /api/tasks 

router.get('/:id/tags', async (req, res) => {
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        taskToTag.find(
            {
                    task: mongoose.Types.ObjectId(req.params.id),
                    userId: mongoose.Types.ObjectId(decoded._id)
            })
            .populate('tag')
            .exec()
            .then( docs => {
                const tags = docs.map(doc => {
                    return doc.tag;
                })
                res.send(tags);
        })
    })
});

router.delete('/:taskId/tags/:tagId', async (req, res) => {
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        const relation = await taskToTag.findOneAndDelete(
            {
                task : mongoose.Types.ObjectId(req.params.taskId), 
                tag : mongoose.Types.ObjectId(req.params.tagId),
                userId : mongoose.Types.ObjectId(decoded._id)
            }
        )
        if(!relation) return res.status(404).send('Relation between given IDs is not found.')
        res.send(relation);
    })    
});

router.post('/:taskId/tags/:tagId', async (req, res) => {
    const { error } = taskToTagValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const isExisting = Boolean(await taskToTag.findOne({
        task : mongoose.Types.ObjectId(req.params.taskId),
        tag : mongoose.Types.ObjectId(req.params.tagId)
    }));
    if(isExisting) {
        return res.status(400).send('This relation is existing');
    }
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        let relation = new taskToTag({
            task: mongoose.Types.ObjectId(req.params.taskId),
            tag: mongoose.Types.ObjectId(req.params.tagId),
            userId: mongoose.Types.ObjectId(decoded._id)
        });
        relation = await relation.save();
    
        res.send(relation);
    })
});
module.exports = router;