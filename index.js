const mongoose = require('mongoose');
const tasks = require('./routes/tasks');
const tagsRoutes = require('./routes/tagsRoutes');
const getTagsByTaskID = require('./routes/getTagsByTaskID');
const express = require('express');
const app = express();

mongoose.connect('mongodb://localhost/todo')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.json());
app.use('/api/tasks', tasks);
app.use('/api/tags', tagsRoutes);
app.use('/api/getTags', getTagsByTaskID);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));