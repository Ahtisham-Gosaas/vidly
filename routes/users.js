const auth = require('../middlewares/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({email: req.body.email});
  if (user) return res.status(400).send('User already registered!');

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);
  user = new User({
    email: req.body.email,
    name: req.body.name,
    password: hashed
  });

  await user.save();

  const token = user.generate_auth_token();
  res.header('x-jwt-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;