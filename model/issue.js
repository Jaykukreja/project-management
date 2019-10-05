const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },

  description: {
    type:String,
    required: true
  },

  name: {
    type: String
  },
  
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],

  date: {
    type: Date,
    default: Date.now
  },

  assigned:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },

  classification:{
    type:String,
    required:true,
    default:other
  },

  severity:{
    type:String,
    required:true,
    default:other
  }
});

module.exports = Issue = mongoose.model('issue', IssueSchema);
