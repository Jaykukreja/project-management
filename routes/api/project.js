const express = require("express");
const router = express.Router();
const mongoose =require('mongoose');
const passport =require('passport');
var nodemailer = require("nodemailer");


//Load validation 
const validateProjectinput = require('../../validation/project');
const validateTaskinput = require('../../validation/task');

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

    function sendmail(name){
       // var s=tosend
        var smtpTransport = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure:true,
            requiresAuth: true,
          domains: ["gmail.com", "googlemail.com"],
            auth: {
              user: "testiotsap@gmail.com",
              pass: "dynamo2818"
            }
          });


          var mailOptions = {
            to: name,
            subject: "You are invited for a project",
            text: "hi there"
          };
          //console.log(mailOptions);
          smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
              throw error;
            } else {
              console.log("Message sent: " + response);
              //res.send(response);
            }
          });
    }

     const {errors, isValid } = validateProjectinput(req.body);
    console.log("lloo",isValid)
    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.json(errors);
    }

    // Get fields
    const projectFields ={};
    console.log(req.user.id)
    projectFields.user = req.user.id;
    //console.log(req.user.name)
    //console.log(req.id)
    //console.log(payload)
    if(req.body.projectName) projectFields.projectName = req.body.projectName;
    if(req.body.description) projectFields.description = req.body.description;
    if(req.body.guide) projectFields.guide = req.body.guide;
    projectFields.owner = req.user.email;
     //Members - Split into array
     if(typeof req.body.members !== 'undefined'){
        projectFields.members= req.body.members.split(',');
    }

    //console.log(projectFields.members)
    var i;
    for (i = 0; i < projectFields.members.length; i++) {
        //text += cars[i] + "<br>";
        sendmail(projectFields.members[i])
        console.log(projectFields.members[i])
    }
    projectFields.members.push(req.user.email)
    projectFields.members.push(req.body.guide)
    // projectFields.date={};
    if(req.body.from) projectFields.from = req.body.from;
    if(req.body.to) projectFields.to = req.body.to;

    User.findOne({user : req.user.id})
        .then(user=>{
            if (user){
                //Update
                console.log("inside")
                User.findOneAndUpdate(
                    {user:req.user.id}, 
                    {$set :projectFields}, 
                    {new :true}
                )
                .then(user => res.json(user));
                
            }else {
                //Create
                console.log("8999")

                // //Check if handle exists
                // User.findOne({email : projectFields.email })
                // .then(user =>{
                //     if(user) {
                //         errors.handle =' That handle already exists';
                //         res.status(400).json(errors);
                //     }
                //Save profile
                new Project(projectFields).save().then(Project => res.json({success: true,Project}))

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

//get myprojects
router.post('/myprojects', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    // console.log(req)
    const id=req.user.id
    console.log(req.user.email)
    Project.find({$or : [{user: id },{members:{$in:req.user.email}}]},['members','projectName','description','from','to','owner','_id','guide'])
     .sort({date:-1})
     .then(projects=> res.json({success:true,projects}))
     .catch(err => res.json({ noprojectfound :'No Project found'}));
});

//Add task
router.post('/addTask', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    const {errors,isValid } = validateTaskinput(req.body);
    //check validation
    if(!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }


     //function for mail

     function sendmail(name){
        // var s=tosend
         var smtpTransport = nodemailer.createTransport({
             service: "gmail",
             host: "smtp.gmail.com",
             port: 587,
             secure:true,
             requiresAuth: true,
           domains: ["gmail.com", "googlemail.com"],
             auth: {
               user: "testiotsap@gmail.com",
               pass: "dynamo2818"
             }
           });
 
 
           var mailOptions = {
             to: name,
             subject: "You are assigned a task for a project",
             text: "hi there"
           };
           //console.log(mailOptions);
           smtpTransport.sendMail(mailOptions, function(error, response) {
             if (error) {
               throw error;
             } else {
               console.log("Message sent: " + response);
               //res.send(response);
             }
           });
     }


     sendmail(req.body.assigned)
   
    //take project id from ankit
    Project.findOne({_id:req.body.projectId})
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
            
            project.save().then(project=> res.json({success:true,task:project.task}));
        })
});

router.post('/getTask', passport.authenticate('jwt',{session:false}),
(req,res)=>{

    //take project id from ankit
    Project.findOne({_id:req.body.projectId}).then
    (project=> {
        res.json({success:true,task:project.task});
    })
});


//post myTask
// //db.articles.find({
//     "stock.country" : "01",
//     "stock.warehouse.code" : "02"
// }).pretty();

// db.articles.find(
//     { _id : 3 },
//     { stock : { $elemMatch : { country : "01" } } }
//   ).pretty();

// db.orders.aggregate([
//     { $match: { status: "A" } },
//     { $group: { _id: "$cust_id", total: { $sum: "$amount" } } },
//     { $sort: { total: -1 } }
//   ]), assignedto: { assigned: taskemail } }

// db.school.aggregate([
//     { $unwind :'$students'},
//     { $match : {'students.score': { $gt : 80} }},
//     { $project : { _id:0, rollNo : '$students.rollNo', name : '$students.name', score : '$students.score' } }
//     ])
router.post('/myTask', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    console.log(req.user.email)
    //take project id from ankit
    const taskemail=req.user.email;
    // Project.find({ "projectName": "Android" },{"task" : { $elematch : {assigned:taskemail}}}).then
    // Project.aggregate([
    //     { $match: {projectName: "Android" } },
    //     { $group: { _ass: "$assigned" }}
    //   ]).then
   Project.aggregate([
        { $unwind :'$task'},
        { $match : {'task.assigned': taskemail }},
        { $project : { _id:0, title : '$task.title', priority : '$task.priority'} }
        ]).then
    (project=> {
        console.log(project)
        res.json({success:true,task:project});
    })
    .catch(err => res.json({ noprojectfound :err}));
});

//Add teamMates
router.post('/addteamMates', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    Project.findOne({_id:req.body.projectId})
        .then(project => {
                       
                const newTeam ={
                teamMates:req.body.teamMates,
                role:req.body.role
            }
            console.log(req.body);
            project.team.unshift(newTeam);
           
            project.save().then(project=> res.json(project))
            
        })
        .catch(err => res.json({ noprojectfound :err}));

});

// db.foo.update(
//     { _id: 1 },
//     { $addToSet: { colors: "c" } }
//  )
//Add Member to project
router.post('/addmember', passport.authenticate('jwt',{session:false}),
(req,res)=>{
    Project.findOne({_id : req.body.projectId})
     .then(project => {
        if (project){
            //Update
            console.log("inside")
            Project.update(
                {_id : req.body.projectId },
                { $addToSet: { members: req.body.member } },
                //{members:req.body.member},
                //{ $push: { members: req.body.member } },
                //{new :true}
            )
            .then(project => res.json(project));
            console.log(project)
        }

     })
     .catch(err => res.json(err));
})


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