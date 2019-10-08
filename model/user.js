const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create user schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  verified:{
    type:Boolean,
    default:false
    }
//   avatar: {
//     type: String
//   }
});

module.exports = User = mongoose.model("users", UserSchema);
