import dotenv from 'dotenv'
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

dotenv.config()

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err))

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, world!');
})

app.post('/auth/login', (req, res) => {
  console.log(req.body);

  const token = jwt.sign({
    email: req.body.email,
    fullName: "John Doe",
  }, process.env.JWT_SECRET);

  res.json({
    success: true,
    token
  })
})

app.listen(4444, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Server OK');
})