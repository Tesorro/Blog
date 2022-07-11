import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './middlewares/auth.js';
import checkAuth from './middlewares/checkAuth.js';
import { UserController, PostController } from './controllers/index.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

dotenv.config()

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express();


const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register',registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Server OK');
})