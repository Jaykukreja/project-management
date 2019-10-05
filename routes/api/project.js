const express = require("express");
const router = express.Router();
const mongoose =require('mongoose');
const passport =require('passport');
var nodemailer = require("nodemailer");


//Load validation 
const validateProjectinput = require('../../validation/project');

/** Load Model */
const Project = require("../../model/project");
const User = require("../../model/user");


router.post("/test", (req, res) => {
    res.send('hello')

});


// router.post("/addproject", (req, res) => {
// 	//const { errors, isValid }= validateProjectinput(req.body);
//     User.findOne({user : req.params.id})
//      .then(project => {
         
         

//      })
    // const newProject = new Project({
    //     title : req.body.title,
    //     description : req.body.description,
    //     owner : req.body.owner,
    //     team : req.body.team,

    //     //task
    //     User.findOne({email:req.body.assigned}) 
    //      .then(user=>){
    //          if(user){
    //             const assigned=req.body.assigned
    //          }
    //          else {
    //             return res.status(404).json(errors);             }
    //      }
         
    //     const newdate ={
    //         from : req.body.from,
    //         to : req.body.to
    //     }

    //     //Add to date array

    //     project.date.unshift(newdate)

    //     //save
    //     project.save().then()


    //     password : req.body.password
    // });

// });

router.post('/create', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    console.log("koookokoko")
    console.log(req.body)


    //function for mail

    // function sendmail(name){
    //    // var s=tosend
    //     var smtpTransport = nodemailer.createTransport({
    //         service: "gmail",
    //         host: "smtp.gmail.com",
    //         port: 587,
    //         secure:true,
    //         requiresAuth: true,
    //       domains: ["gmail.com", "googlemail.com"],
    //         auth: {
    //           user: "testiotsap@gmail.com",
    //           pass: "dynamo2818"
    //         }
    //       });


    //       var mailOptions = {
    //         to: name,
    //         subject: "kakakakakkakakka",
    //         text: "lo"
    //       };
    //       console.log(mailOptions);
    //       smtpTransport.sendMail(mailOptions, function(error, response) {
    //         if (error) {
    //           throw error;
    //         } else {
    //           console.log("Message sent: " + response);
    //           res.send(response);
    //         }
    //       });
    // }

    //const {errors, isValid } = validateProjectinput(req.body);

    //check validation
    // if(!isValid) {
    //     //Return any errors with 400 status
    //     return res.status(400).json(errors);
    // }

    // Get fields
    const projectFields ={};
    projectFields.user = req.user.id;

    if(req.body.projectName) projectFields.projectName = req.body.projectName;
    if(req.body.description) projectFields.description = req.body.description;
    if(req.body.team) projectFields.team = req.body.team;
    //projectFields.owner = req.user.email;
     //Members - Split into array
     if(typeof req.body.members !== 'undefined'){
        projectFields.members= req.body.members.split(',');
    }

    // console.log(projectFields.members)
    // var i;
    // for (i = 0; i < projectFields.members.length; i++) {
    //     //text += cars[i] + "<br>";
    //     sendmail(projectFields.members[i])
    //     console.log(projectFields.members[i])
    // }

    projectFields.date={};
    // if(req.body.from) projectFields.date.from = req.body.fromDate;
    // if(req.body.to) projectFields.date.to = req.body.toDate;

    User.findOne({user : req.user.id})
        .then(user=>{
            if (user){
                //Update
                User.findOneAndUpdate(
                    { user:req.user.id}, 
                    {$set :projectFields}, 
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
                new Project(projectFields).save().then(Project => res.json(Project))

                };
            }
    )
    
    
    .catch(err => res.json(err));

});


//All project
router.get('/all',(req,res) => {
    const errors = {};
    Project.find()
    .populate('user',['name','email'])
    .then(projects => {
        if(!projects){
            errors.noproject =' There are no Project';
            return res.status(404).json();
        }
        res.json(projects);
    })
    .catch(err => res.status(404).json({project : "There are no projects"}));
});


//Add task
router.post('/task', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    // const {errors,isValid } = validateExperienceinput(req.body);
    // //check validation
    // if(!isValid) {
    //     //Return any errors with 400 status
    //     return res.status(400).json(errors);
    // }

    //take project id from ankit
    Project.findOne({user :req.user.id})
        .then(project => {
            const newTask = {
                title :req.body.title,
                description:req.body.description,
                from:req.body.from,
                to :req.body.to,
                assigned:req.body.assigned,
                priority:req.body.priority,
            }
            //Add to exp array
            project.task.unshift(newTask); //to add in the beginning
            
            project.save().then(project=> res.json(project));
        })
});


//Add milestone
router.post('/milestone', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    //take project id from ankit
    Project.findOne({user :req.user.id})
        .then(project => {
            const newMilestone = {
                title :req.body.title,
                from:req.body.from,
                to :req.body.to,
                assigned:req.body.assigned
            }
            //Add to exp array
            project.milestone.unshift(newMilestone); //to add in the beginning
   
            project.save().then(project=> res.json(project));
        })
});
module.exports = router;