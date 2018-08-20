var users = require('./db/users');

var user = {  
	  email: 'user1',
	    password: 'bonsoir',
	    name: 'John Doe',
	      address: '1 Sesame Street'
};

var crypto = require('crypto');
var hash = crypto.createHash('whirlpool');
//passing the data to be hashed
data = hash.update(user.password, 'utf-8');
//Creating the hash in the required format
gen_hash= data.digest('hex');

console.log(gen_hash);
user.password = gen_hash;

users.create(user, function(err) {  
	  if (err) {
		      throw err;
		        }
	    else {
		        console.log('user inserted');
			  }
});
