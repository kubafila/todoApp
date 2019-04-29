const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cors = require('cors');
const mongoose = require('mongoose');
const tasks = require('./routes/tasks');
const tagsRoutes = require('./routes/tagsRoutes');
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const path = require('path');
const router = express.Router();
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined.');
  //w terminalu: export todo_jwtPrivateKey=todoApp_jwtPrivateKey
  process.exit(1);
}

mongoose.connect('mongodb://localhost/todo')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

app.use(cors());
app.use(express.json());
app.use('/api/tasks', tasks);
app.use('/api/tags', tagsRoutes);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(express.static("src"));
app.use('/app', express.static('/src/app'))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
