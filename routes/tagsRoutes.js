const {
    Tag,
     validateTag
} = require('../models/tag');
const { taskToTag, taskToTagValidation } = require('../models/taskToTag');
const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/', async (req, res) => {
    let tags;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        tags = await Tag.find({userId: decoded._id}).sort('name');
    });
    res.send(tags);
})

router.get('/:id', async (req, res) => {
    let tag;
    
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        tag = await Tag.findOne({_id: mongoose.Types.ObjectId(req.params.id), userId: decoded._id}).sort('name');
    });
    if (!tag) return res.status(404).send('The tag with the given ID was not found.');
    else res.send(tag);
})

router.post('/', async (req, res) => {
    const { error } = validateTag(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if tag exists
    const isExisting = Boolean(await Tag.findOne({name: req.body.name}));
    if(isExisting) return res.status(400).send('This tag already exists');
    
    let tag;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), function(err, decoded) {
        tag = new Tag({
            name: req.body.name,
            color: req.body.color,
            userId: mongoose.Types.ObjectId(decoded._id)
        });
    });    
    tag = await tag.save();

    res.send(tag);
});

router.put('/:id', async (req, res) => {
    const {error} = validateTag(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let tag;
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        tag = await Tag.findOneAndUpdate({
            _id: mongoose.Types.ObjectId(req.params.id),
            userId: mongoose.Types.ObjectId(decoded._id)
        }, {
            name: req.body.name,
            color: req.body.color,
            userId: mongoose.Types.ObjectId(decoded._id)
        }, {
            new: true
        });
        
        if (!tag) return res.status(404).send('The tag with the given ID was not found.');
        
        res.send(tag);
    });
});

router.delete('/:id', async (req, res) => {
    let tag; 
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        tag = await Tag.findOneAndDelete(
            {
                _id: mongoose.Types.ObjectId(req.params.id), 
                userId: mongoose.Types.ObjectId(decoded._id)
            }
        );
    })

    if (!tag) return res.status(404).send('The tag with the given ID was not found.');
    else while(await taskToTag.findOneAndDelete(
        {
            tag: mongoose.Types.ObjectId(req.params.id)
        }
    ));

    res.send(tag);
});


// 
// relation tag - task
// /api/tasks 

router.get('/:id/tasks', async (req, res) => {
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        taskToTag.find(
            {
                tag: mongoose.Types.ObjectId(req.params.id),
                userId: mongoose.Types.ObjectId(decoded._id)
            })
            .populate('task')
            .exec()
            .then( docs => {
                const tasks = docs.map(doc => {
                    return doc.task;
                })
                res.send(tasks);
        })
    })
});

router.delete('/:tagId/tasks/:taskId', async (req, res) => {
    jwt.verify(req.headers['x-auth-token'], config.get('jwtPrivateKey'), async function(err, decoded) {
        const relation = await taskToTag.findOneAndDelete(
            {
                task: mongoose.Types.ObjectId(req.params.taskId), 
                tag: mongoose.Types.ObjectId(req.params.tagId),
                userId: mongoose.Types.ObjectId(decoded._id)
            }
        )
        if(!relation) return res.status(404).send('Relation between given IDs is not found')
        res.send(relation);
    
    })
});

router.post('/:tagId/tasks/:taskId', async (req, res) => {
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