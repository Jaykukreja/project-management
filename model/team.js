const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create project schema
const TeamSchema = new Schema({

    leader:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },


    name:{
        type:String,
        required:true
    },

    members:[{
        users : {
            type:[String],
            //ref: 'users',
            required:true
          },
        
          roles: {
              type:String,
              required:true
          }
    }],

    guide:{
        type:String
    }

});

module.exports = Team = mongoose.model("team", TeamSchema);