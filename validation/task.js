const validator=require('validator');
const isEmpty=require('./is-empty');
module.exports = function validateProjectinput(data){
	let errors ={
	};
	console.log(data.assigned)
	const taskFields ={};


    //Members - Split into array
	if(typeof data.assigned !== 'undefined'){
        taskFields.assigned= data.assigned.split(',');
    }
    

    console.log(taskFields.assigned)

	// var i;
    // for (i = 0; i < taskFields.assigned.length; i++) {
	// 	console.log(taskFields.assigned[i])
	// 	if(!validator.isEmail(taskFields.assigned[i])){
	// 	errors.assigned ='assigned field must have valid Email Ids';

	// }
    // }
	//console.log(data)
	data.title=!isEmpty(data.title) ? data.title : '';
	data.description=!isEmpty(data.description) ? data.description : '';
	//data.assigned=!isEmpty(data.assigned) ? data.members : '';
	data.from=!isEmpty(data.from) ? data.from : '';
    data.to=!isEmpty(data.to) ? data.to : '';
    data.priority=!isEmpty(data.priority) ? data.priority : '';
    data.assigned=!isEmpty(data.assigned) ? data.assigned : '';
	
	if(!validator.isLength(data.description,{min :2 ,max:60})){
		console.log("/////")
		errors.description ='Description must be between 2 and 30 characters';
	}

	if(validator.isEmpty(data.title)){
		errors.title ='Title is required';

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