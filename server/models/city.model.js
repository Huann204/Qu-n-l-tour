const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    name: String
  },
);

const City = mongoose.model('City', schema, "cities");

module.exports = City;