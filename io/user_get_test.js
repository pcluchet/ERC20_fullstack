var users = require('./db/users');

users.comparepwd( 'ndoe@example.com' , "bonsoir", function(err, result) {  
	  if (err) {
		      throw err;
		        }
	    else {
		        console.log('user :' + JSON.stringify(result));
			  }
});

