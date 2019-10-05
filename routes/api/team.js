const express = require("express");
const router = express.Router();
const mongoose =require('mongoose');
const passport =require('passport');


/** Load Model */
const Team = require("../../model/team");

router.post('/', passport.authenticate('jwt',{session:false}),
(req,res)=>{
     //take project id from ankit


    // Get fields
    const teamFields ={};
    teamFields.leader=req.user.id
    if(req.body.name) teamFields.name = req.body.name;
    if(req.body.guide) teamFields.guide = req.body.guide;


    teamFields.members={};
    teamFields.members.users={};
    teamFields.members.roles={};
    console.log(teamFields)

    //Members - Split into array
    if(typeof req.body.users !== 'undefined'){
        teamFields.members.users= req.body.users.split(',');
    }

    if(typeof req.body.roles !== 'undefined'){
        teamFields.members.roles= req.body.roles.split(',');
    }
    console.log(teamFields)

    User.findOne({user : req.user.id})
        .then(user=>{
            if (user){
                //Update
                Team.findOneAndUpdate(
                    {leader:req.user.id}, 
                    {$set :teamFields}, 
                    {new :true}
                )
                .then(user => res.json(user));
                
            }else {
                //Create


                // //Check if handle exists
                // User.findOne({email : projectFields.email })
                // .then(user =>{
                //     if(user) {
                //         errors.handle =' That handle already exists';
                //         res.status(400).json(errors);
                //     }
                //Save profile
                new Team(teamFields).save().then(Team => res.json(Team))
                };
            }
    )
    
    
    .catch(err => res.status(404).json(err));
    


});


module.exports = router;