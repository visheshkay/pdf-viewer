const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AcronymSchema = new Schema({
  acronym: String,
  definition: String
});


module.exports = mongoose.model('Acronym', AcronymSchema);
