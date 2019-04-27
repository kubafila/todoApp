const {Tag, validateTag} = require('../models/tag');
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

module.exports = router;