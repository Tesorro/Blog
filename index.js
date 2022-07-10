import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './middlewares/auth.js';
import checkAuth from './middlewares/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

dotenv.config()

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json());

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/posts', PostController.getAll);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Server OK');
})