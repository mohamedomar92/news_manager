const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/users');

const router = new express.Router();

// create user
router.post('/users', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateToken();
    console.log(token);
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Login
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send('Try again ' + e);
  }
});

// Get all users
router.get('/users', auth, (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

// Get by Id
router.get('/user/:id', auth, async (req, res) => {
  const _id = req.params.id;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(400).send('Unable to find user');
      }
      res.status(200).send(user);
    })
    .catch((e) => {
      res.status(500).send('Unable to connect to database');
    });
});

// update
router.patch('/users/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'password'];
  var isvalid = updates.every((el) => allowedUpdates.includes(el));
  if (!isvalid) {
    return res.status(400).send('Sorry cannot update');
  }
  const _id = req.params.id;
  try {
    const user = await User.findById(_id);
    updates.forEach((el) => (user[el] = req.body[el]));
    await user.save();
    console.log(user);
    if (!user) {
      return res.send('No user is found');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(400).send('No user found');
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

// logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((el) => {
      return el.token !== req.token;
    });

    await req.user.save();
    res.send('Logout successfully');
  } catch (e) {
    res.status(500).send('Error please try again');
  }
});

// logout all
router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send('Logout all was done successsfully');
  } catch (e) {
    res.send('Please login');
  }
});

module.exports = router;
