const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const pages = new Schema({
  
  title: {
    type: String,
    required : true
  },
  slug: String,
  content: {
    type: String,
    required : true
  },
  sorting: Number
});

module.exports = mongoose.model('pages', pages);