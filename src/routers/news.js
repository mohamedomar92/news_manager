const express = require('express');
const News = require('../models/news');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/new', auth, async (req, res) => {
  const news = new News({ ...req.body, owner: req.user._id });
  try {
    await news.save();
    res.status(201).send(news);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/new', auth, async (req, res) => {
  try {
    await req.user.populate('userNews').execPopulate();
    res.send(req.user.userNews);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/new/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const N = await News.findOne({ _id, owner: req.user._id });
    if (!N) {
      return res.status(400).send('No News found');
    }
    res.status(200).send(N);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch('/new/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'description'];
  var isValid = updates.every((el) => allowedUpdates.includes(el));

  if (!isValid) {
    return res.status(400).send('Cannot update');
  }
  const _id = req.params.id;
  try {
    const N = await News.findOne({ _id, owner: req.user._id });
    updates.forEach((el) => (N[el] = req.body[el]));
    await N.save();
    res.send(N);
  } catch (e) {
    res.status(400).send('No News found ');
  }
});

router.delete('/new/:id', auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const N = await News.findOneAndDelete({ _id, owner: req.user._id });
    if (!N) {
      return res.status(400).send('No News found');
    }
    res.status(200).send(N);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
