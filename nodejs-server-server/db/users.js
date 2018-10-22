var users = require('./couchdb').use('users');

exports.create = function create(user, cb) {  
	  users.insert(user, user.email, cb);
};

exports.get = function get(id, cb) {  
	  users.get(id, cb);
};

exports.comparepwd = function get(id,pwd, cb) {  

	var crypto = require('crypto');
var hash = crypto.createHash('whirlpool');
//passing the data to be hashed
data = hash.update(pwd, 'utf-8');
//Creating the hash in the required format
gen_hash= data.digest('hex');


	  users.get(id, function (err,result) {
			console.log("result : " + JSON.stringify(result))
			if (!result || !result.password)
			{
				console.log("user not found or request problem")
				cb(err,false);
			}
			else
			{
			if (gen_hash == result.password)
			{
				console.log("pass ok")
				cb(err, true);
			}
			else
			{
				console.log("pass not ok")
				cb(err, false);
			}
		}
	  });
};


exports.comparepwd_pub = function get(id,pwd, cb) {  

	var crypto = require('crypto');
var hash = crypto.createHash('whirlpool');
//passing the data to be hashed
data = hash.update(pwd, 'utf-8');
//Creating the hash in the required format
gen_hash= data.digest('hex');


var retu = {  
	valid: false,
	pubkey : "",
};

	  users.get(id, function (err,result) {
			console.log("result : " + JSON.stringify(result))
			if (!result || !result.password)
			{
				console.log("user not found or request problem")
				cb(err,retu);
			}
			else
			{
			if (gen_hash == result.password)
			{
				console.log("pass ok")
				retu.pubkey = result.pubkey;
				retu.valid = true;
				cb(err, retu);
			}
			else
			{
				console.log("pass not ok")
				cb(err, retu);
			}
		}
	  });
};
