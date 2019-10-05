const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose =require('mongoose');
const passport =require('passport');
const jwt =require("jsonwebtoken");
const keys=require('../../config/keys');


//load input validation 
const validateRegisterinput = require('../../validation/register');
const validateLogininput = require('../../validation/login');


/** Load Model */
const User = require("../../model/user");

router.get('/test',(req,res)=>res.json({msg:"it workss"}));

router.post('/register',(req,res)=>{
	console.log(req.body)
	const { errors, isValid } = validateRegisterinput(req.body);

	// // check validation 
	// if (!isValid){
	// 	return res.json(errors);
	// }

	if(errors.name || errors.email || errors.password || errors.confirmPassword) {
		return res.json(errors)
	}
	console.log(errors)

	User.findOne({email:req.body.email})
		.then(user => {
			if(user){
				errors.email="Email already exists!";
				return res.json(errors);
			}
			else {

				const newUser = new User({
					name : req.body.name,
					email : req.body.email,
					password : req.body.password
				});

				bcrypt.genSalt(10,(err,salt)=> {
					bcrypt.hash(newUser.password,salt,(err,hash)=>{
						if (err) throw err;
						newUser.password=hash;
						newUser.save()
						.then(user=>{
							user = {
								...user,
								status: true
							}
							console.log(user)
							return res.json(user)})
						.catch(err=> console.log(err))
					})
				})

			}
		})
})

// router.post("/register", (req, res) => {
//   const errors = {
//     status: false,
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   };
//   const response = {
//     status: false,
//     email: ""
//   };
//   if (
//     req.body.name == "" ||
//     req.body.email == "" ||
//     req.body.password == "" ||
//     req.body.confirmPassword == ""
//   ) {
//     if (req.body.name == "") {
//       errors.name = "Name is required";
//     }
//     if (req.body.email == "") {
//       errors.email = "Email is required";
//     }
//     if (req.body.password == "") {
//       errors.password = "Password is required";
//     }
//     if (req.body.confirmPassword == "") {
//       errors.confirmPassword = "Confirm Password is required";
//     }
//     return res.json(errors);
//   }
//   console.log(req.body)
//   if (req.body.password != req.body.confirmPassword) {
//     errors.confirmPassword = "Password didn't match";
//     return res.json(errors);
//   }
//   User.findOne({ email: req.body.email }).then(user => {
//     if (user) {
//       errors.email = "User with this email already exists";
//       return res.json(errors);
//     } else {
//       const newUser = new User({
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//       });
//       newUser
//         .save()
//         .then(user => {
//           response.status = true;
//           response.email = req.body.email;
//           return res.json(response);
//         })
//         .catch(err => console.log(err));
//     }
//   });
// });

// router.post("/login", (req, res) => {
//   const errors = {
//     loggedIn: false,
//     email: "",
//     password: ""
//   };
//   const response = {
//     email: "",
//     token: "",
//     loggedIn: false
//   };

//   if (req.body.email == "" || req.body.password == "") {
//     if (req.body.email == "") {
//       errors.email = "Email is required";
//     }
//     if (req.body.password == "") {
//       errors.password = "Password is required";
//     }
//     return res.json(errors);
//   }
//   const email = req.body.email;
//   const password = req.body.password;
//   /** Find user by email */
//   User.findOne({ email }).then(user => {
//     /** Check for user */
//     if (!user) {
//       errors.email = "User not found";
//       return res.json(errors);
//     }
//     /** Check password */
//     if (user.password == password) {
//       response.loggedIn = true;
//       response.email = user.email;
//       response.token = "testToken";
//       return res.json(response);
//     } else {
//       errors.password = "Wrong Password";
//       return res.json(errors);
//     }
//   });
// });


// @route    POST api/users/login
// @desc     login user / returning JWT token
// @access   Public
router.post('/login',(req,res)=>{
	const response = {
		loggedIn: false
	}
	const { errors,isValid }= validateLogininput(req.body);

	// check validation 
	// if (!isValid){
	// 	//errors.email='';
	// 	//errors.password='';
	// 	//errors.loggedIn=false;
	// 	console.log("poopop")
	// 	console.log(errors)
	// 	return res.json(errors);
	// }


	const email=req.body.email;
	const password=req.body.password;
	console.log("ko")
	//find user by email
	User.findOne({email})
	.then(user => {
		//check for user
		if (!user){
			errors.email='user not found'
			return res.json(errors);
		}

		//check password 
		bcrypt.compare(password,user.password)
		.then(isMatch =>{
			if(isMatch){
				//user matched
				console.log("kkiiii")
				const payload={id:user.id,name:user.name,email:user.email}
				//create jwt payload
				//sign token
				jwt.sign(
					payload,
					keys.secretOrKey,
					{expiresIn:'365d'},
					(err,token)=>{
						console.log("looo")
						response.loggedIn = true;
						response.email = payload.email;
						response.token ='Bearer '+token;
						response.name = payload.name;
						response.imageUri = "https://loremflickr.com/200/200"
						console.log(response)
						return res.json(response)
					});
			}
			else {
				console.log("pppp")
				//errors.email='';
				//errors.loggedIn=false;
				errors.password='password incorrect'
				return res.json(errors)
			}
		})
	})
});


module.exports = router;
