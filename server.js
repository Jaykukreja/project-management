const express =require('express');
const mongoose = require("mongoose");
const connectDB=require('./config/db');
const bodyParser = require('body-parser');
const passport =require('passport');
var nodemailer = require("nodemailer");



// Define Routes
const user=require('./routes/api/user');
const team=require('./routes/api/team');
const project=require('./routes/api/project');

//intialize express
const app = express();

//Database Connection
connectDB();


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


app.get("/send", function(req, res) {
  var mailOptions = {
    to: "jayeshkukreja27@gmail.com",
    subject: "kakakakakkakakka",
    text: "lo"
  };
  console.log(mailOptions);
  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      throw error;
    } else {
      console.log("Message sent: " + response);
      res.send(response);
    }
  });
});

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);


/** Body Parser Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** Use routes */
app.use("/api/user", user);
app.use("/api/project", project);
app.use("/api/team", team);


const port = process.env.PORT || 2000;
console.log("44444")

app.listen(port, () => console.log(`Server running on port ${port}`));





