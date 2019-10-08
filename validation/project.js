const validator=require('validator');
const isEmpty=require('./is-empty');
module.exports = function validateProjectinput(data){
	let errors ={

	};
	console.log(data.members)
	const projectFields ={};

	//Members - Split into array
	if(typeof data.members !== 'undefined'){
        projectFields.members= data.members.split(',');
	}
	console.log(projectFields.members)

	var i;
    for (i = 0; i < projectFields.members.length; i++) {
		console.log(projectFields.members[i])
		if(!validator.isEmail(projectFields.members[i])){
		errors.members ='members field must have valid Email Ids';

	}
    }
	//console.log(data)
	data.projectName=!isEmpty(data.projectName) ? data.projectName : '';
	data.description=!isEmpty(data.description) ? data.description : '';
	//data.members=!isEmpty(data.members) ? data.members : '';
	data.from=!isEmpty(data.from) ? data.from : '';
	data.to=!isEmpty(data.to) ? data.to : '';
	
	if(!validator.isLength(data.description,{min :2 ,max:60})){
		console.log("/////")
		errors.description ='Description must be between 2 and 30 characters';
	}

	if(validator.isEmpty(data.projectName)){
		errors.projectName ='ProjectName is required';

	}

	if(!validator.isEmail(data.guide)){
		errors.guide ="Guide's Email is invalid";

	}

	if(validator.isEmpty(data.from)){
		errors.from ='from field is required';
	}

	if(validator.isEmpty(data.to)){
		errors.to ='to field is required';
	}
	console.log("4454545545")

	
	return {
		
		errors,
		isValid :isEmpty(errors) 
	}
}