const mongoose = require('mongoose');

const newSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    reuired: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const New = mongoose.model('News', newSchema);
module.exports = New;
