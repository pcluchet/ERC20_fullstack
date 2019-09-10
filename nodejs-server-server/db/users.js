var users = require('./couchdb').use('users');

exports.create = function create(user, cb) {
	users.insert(user, user.email, cb);
};

/*
exports.search = function search(regex, cb) {
	//console.log(users.find({zip:{'$regex' : regex, '$options' : 'i'}});
	//users.find({"_id" : new RegExp(regex, 'i') }, cb);
	if (!regex)
		regex = "";
	users.find({
		"selector": {
		   "_id": {
			  "$regex": "^" + regex + ".*$"
		   }
 
		},
		"fields": [
			"_id",
			"pubkey"
		  ]
	 }, cb);
};
*/

exports.search = function search(regex, cb) {
	//console.log(users.find({zip:{'$regex' : regex, '$options' : 'i'}});
	//users.find({"_id" : new RegExp(regex, 'i') }, cb);
	if (!regex)
		regex = "";

		const batchSize = 25;
		let batchCount = 0;
		let searchResults = [];
		
		// the recursive function
		let search = function (count, limit){
 	return users.find({
		"selector": {
		   "_id": {
			  "$regex": "^" + regex + ".*$"
		   }
 
		},
		"fields": [
			"_id",
			"pubkey"
		  ],
		  "limit": batchSize,
        "skip": batchCount * batchSize
			}).then(function(batch){
				if (batch.docs.length === 0){
					// there are no (more) search results, so we can return what we have
		

					console.log(JSON.stringify(searchResults));
					return searchResults
		
				} else {
					// there may be more search results, so we add this batch to the result and call the function again to ask more. We increase the counter so that the first batch(es) are skipped
		
					for (var i = 0; i < batch.docs.length; i++) {
						searchResults.push(batch.docs[i])
					}
					batchCount ++
					return search(batchCount, batchSize) 
				}
			})
		}

		search(batchCount, batchSize).then(function(result){
			console.log("haha");
			cb(null,result);
		})
};

exports.searchpubkeys = function searchpubkeys(list, cb) {
	//console.log(users.find({zip:{'$regex' : regex, '$options' : 'i'}});
	//users.find({"_id" : new RegExp(regex, 'i') }, cb);
	console.log("haha");
	if (!list)
		list = [];
	users.find({
		"selector": {
		   "pubkey": { "$in" : list} 
		},
		"fields": [
			"_id",
			"pubkey"
		  ]
	 }, cb);
};

exports.searchpubkey = function searchpubkey(regex, cb) {
	//console.log(users.find({zip:{'$regex' : regex, '$options' : 'i'}});
	//users.find({"_id" : new RegExp(regex, 'i') }, cb);
	if (!regex)
		regex = "";
	users.find({
		"selector": {
		   "pubkey": regex 
		},
		"fields": [
			"_id",
			"pubkey"
		  ]
	 }, cb);
};

function getUsernameByProjectId(projectid, cb) {
	users.find({
		"selector": {
			"projects": {
			   $elemMatch: {
				  "id": projectid
			   }
			}
		 }
	 }, cb);
};

exports.getUsernameByReviewToken = function (token, cb) {
	users.find({
		"selector": {
			"projects": {
			   $elemMatch: {
				  "review_tokens": {
					 $elemMatch: {
						"token": token
					 }
				  }
			   }
			}
		 }
	 }, cb);
};

function updtoken(user, ip, expire, renewduration, linkip, forever, autorenew, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));

		var current_token = {};
		current_token.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		let tk = current_token.token;
		if (linkip) {
			current_token.tokenip = ip;
		}
		else {
			current_token.tokenip = "nolink";
		}
		current_token.autorenew = autorenew;
		current_token.forever = forever;
		current_token.renewduration = renewduration;
		current_token.expire = Math.round(new Date().getTime() / 1000) + expire;

		if (!result.tokenlist)
			result.tokenlist = Array();
		result.tokenlist.push(current_token);
		users.insert(result, user).then(function () {
			cb(tk);
		});
	});
};

exports.UseReviewToken = function useReviewToken(user, registredAs, token, cb) {
	console.log("here");
	users.get(user, function (err, result) {

	var projectid;
	console.log("there");
	console.log(result);
		
		for (key in result.projects)
		{

		for (key2 in result.projects[key].review_tokens)
		{
			if (result.projects[key].review_tokens[key2].token == token)
			{
				projectid = result.projects[key].id;
				if (result.projects[key].review_tokens[key2].registred_as != null)
				{
					cb(true)
				}
				console.log("FOUND");
				result.projects[key].review_tokens[key2].registred_as = registredAs
			}
		}
		console.log("la");
		}
		users.insert(result, user).then(function () {
			cb(false, projectid);
		});
	});
};

exports.submitReview = function (user, projectid, review, cb) {
	console.log("here");
	users.get(user, function (err, result) {
    getUsernameByProjectId(projectid, function (err, ret) {
      console.log("RESRERSRERS:");
      console.log(ret);
      if (ret.docs.length == 0) {
		  cb("error");
		  return;
	  }


	console.log(result);

	console.log("jhjhegtesg");
	if (typeof result.reviewable == "undefined")
	{
		cb("error");
		return;
	}

	console.log("egtesg");
	if ( typeof result.reviewable.projectid == "undefined")
	{
	if (result.reviewable.projectid != projectid)
		{
		cb("error");
		return;
	
		}
		cb("error");
		return;
	}

	console.log("Hi there");
	result.reviewable.done = true;

	var reviewAndSomeMeta = new Object();
	reviewAndSomeMeta.review = review;
	reviewAndSomeMeta.submited_by = user;


	console.log("Hi there");
		
		for (key in ret.docs[0].projects)
		{
			if (ret.docs[0].projects[key].id == projectid)
			{
				ret.docs[0].projects[key].reviews.push(reviewAndSomeMeta);
			}
		console.log("la_");
		}
		users.insert(ret.docs[0], ret.docs[0]._id).then(function () {

			users.insert(result, user).then(function () {
				cb("ok");
			});
	
		});
	  });
	});
};


exports.updLastLogin = updLastLogin;
function updLastLogin(user, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));
		var LastLogin = (result.LastLogin === undefined) ? 0 : result.LastLogin;
		result.LastLogin = Math.round(new Date().getTime() / 1000); 
		users.insert(result, user).then(function () {
		cb(LastLogin);
		});
	});
};

exports.erase_val_token = erase_val_token;
function erase_val_token(user, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));
		result.validation_token = '0';
		users.insert(result, user).then(function () {
		cb(result);
		});
	});
};

exports.actually_reset_pass = actually_reset_pass;
function actually_reset_pass(user, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));
		result.newpass_token = '0';
		result.password = result.new_password;
		users.insert(result, user).then(function () {
		cb(result);
		});
	});
};



//newpass should be already hashed

exports.updpassword = updpassword;
function updpassword(user, newpass, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));

		result.password = newpass;
		users.insert(result, user).then(
			function () 
			{ 
				var ret = "Password updated successfully";
				cb(ret); 
			});
		});
};

exports.addnewpass = addnewpass;
function addnewpass(user, newpass, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));

		result.new_password = newpass;
		result.newpass_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		users.insert(result, user).then(
			function () 
			{ 
				cb(result); 
			});
		});
};



exports.updmisc = updmisc;
function updmisc(user, newpublic, newprivate, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));



		  if (typeof newprivate !== 'undefined')
		  {
			result.misc_private = newprivate;
		  }

		  
		  if (typeof newpublic !== 'undefined')
		  {
			result.misc_public = newpublic;
		  }

		users.insert(result, user).then(
			function () 
			{ 
				var ret = "success";
				cb(ret); 
			});
		});
};


function get_multiplier_transport(kilometers)
{
	if (kilometers <= 0)
		return 0;
	if (kilometers < 5)
	{
		return 2.0
	}
	if (kilometers < 20)
	{
		return 1.5 
	}
	if (kilometers < 70)
	{
		return 1.2 
	}
	if (kilometers >= 70)
	{
		return 1.0 
	}
	return 0;
}


function calc_ptp_stk(project)
{
	var pt_peoples = 0;
	var pt_innov = 0;
	var pt_material = 0;
	var pt_transport = 0;
	var pt_impact = 0;

	var w_pt_peoples = 0;
	var w_pt_innov = 0;
	var w_pt_material = 0;
	var w_pt_transport = 0;
	var w_pt_impact = 0;



	//Peoples
	var direct_peoples_sum = project.PeoplesData.OwnersDirect +
	project.PeoplesData.PartnersDirect +
	project.PeoplesData.CustomersDirect +
	project.PeoplesData.CollectorsDirect +
	project.PeoplesData.MakersDirect +
	project.PeoplesData.ParticipantsDirect +
	project.PeoplesData.OthersDirect;

	if (direct_peoples_sum >= 1 && direct_peoples_sum <= 20)
	{
		pt_peoples = 200;
	}
	else if (direct_peoples_sum >= 21 && direct_peoples_sum <= 100)
	{
		pt_peoples = 500;
	}
	else if (direct_peoples_sum >= 101 && direct_peoples_sum <= 2000)
	{
		pt_peoples = 800;
	}
	else if (direct_peoples_sum >= 2000)
	{
		pt_peoples = 1000;
	}

	//Innovation

	var amount_of_yes = 0;
	for (var propName in project.InnovationData)
	{
		if (project.InnovationData[propName])
		{
			amount_of_yes++;
		}
	}
	  switch(amount_of_yes){
		  case 0:
			  pt_innov = 200;
			  break;
		  case 1:
			  pt_innov = 500;
			  break;
		  case 2:
			  pt_innov = 700;
			  break;
		  case 3:
			  pt_innov = 1000;
			  break;
		  default : 
		      break;
	  }

	  //Material

	  if (project.MaterialData.PETEorPET.present)
	  {
		  pt_material += project.MaterialData.PETEorPET.RecyclingMultiplier * 1000; 
	  }
	  if (project.MaterialData.HDPE.present)
	  {
		  pt_material += project.MaterialData.HDPE.RecyclingMultiplier * 800; 
	  }
	  if (project.MaterialData.PVC.present)
	  {
		  pt_material += project.MaterialData.PVC.RecyclingMultiplier * 400; 
	  }
      if (project.MaterialData.LDPE.present)
	  {
		  pt_material += project.MaterialData.LDPE.RecyclingMultiplier * 600; 
	  }
      if (project.MaterialData.PP.present)
	  {
		  pt_material += project.MaterialData.PP.RecyclingMultiplier * 300; 
	  }
	  if (project.MaterialData.SP.present)
	  {
		  pt_material += project.MaterialData.SP.RecyclingMultiplier * 200; 
	  }

	  //Transport

	  console.log("BOJH");
	  console.log(get_multiplier_transport(project.TransportData.NoFueledVehicle) * 100);
	  
	  pt_transport +=  get_multiplier_transport(project.TransportData.NoFueledVehicle) * 100;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.ElectricVehicle) * 80;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.GasVehicle) * 70;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.Hybrid) * 60;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.PublicTransport) * 50;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.DieselVehicle) * 20;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.SeaFreight) * 10;

	  console.log(pt_transport);
	  pt_transport +=  get_multiplier_transport(project.TransportData.AirFreight) * 10;

	  console.log(pt_transport);

	  //Impact

	  if (project.AmountOfPlasticRemoved < 5)
	  {
		  pt_impact = 200;
	  }
	  else  if (project.AmountOfPlasticRemoved < 100)
	  {
		  pt_impact = 500;
	  }
	  else  if (project.AmountOfPlasticRemoved < 1000)
	  {
		  pt_impact = 700;
	  }
	  else  if (project.AmountOfPlasticRemoved < 10000)
	  {
		  pt_impact = 900;
	  }
	  else  if (project.AmountOfPlasticRemoved >= 10000)
	  {
		  pt_impact = 1000;
	  }

	  if (project.DurationOfTheCycle < 6)
	  {
		  pt_impact *= 2;
	  }
	  else if (project.DurationOfTheCycle < 12)
	  {
		  pt_impact *= 1.5;
	  }
	  else if (project.DurationOfTheCycle < 36)
	  {
		  pt_impact *= 1.3;
	  }
	  else if (project.DurationOfTheCycle >= 36)
	  {
		  pt_impact *= 1.5;
	  }

	  //Relative weights
	project.StakeHoldersEvaluations.forEach(
		  function (element)
		  {
			 w_pt_peoples += element.People;
			 w_pt_innov += element.Innovation;
			 w_pt_material += element.Material;
			 w_pt_transport += element.Transport;
			 w_pt_impact += element.Impact;
		  }

	  );


	w_pt_peoples /= 5;
	w_pt_innov /= 5;
	w_pt_material /= 5;
	w_pt_transport /= 5;
	w_pt_impact /= 5;

	//ptp stakeholders (finally)
	ptp_stk = pt_peoples * w_pt_peoples + 
	pt_innov * w_pt_innov + 
	pt_impact * w_pt_impact +
	pt_material * w_pt_material +
	pt_transport * w_pt_transport;

	console.log("pt_peoples");
	console.log(pt_peoples);
	console.log("pt_innov");
	console.log(pt_innov);
	console.log("pt_material");
	console.log(pt_material);
	console.log("pt_transport");
	console.log(pt_transport);
	console.log("pt_impact");
	console.log(pt_impact);

	console.log("w_pt_peoples");
	console.log(w_pt_peoples);
	console.log("w_pt_innov");
	console.log(w_pt_innov);
	console.log("w_pt_material");
	console.log(w_pt_material);
	console.log("w_pt_transport");
	console.log(w_pt_transport);
	console.log("w_pt_impact");
	console.log(w_pt_impact);




	return (ptp_stk);

}

exports.addproject = addproject;
function addproject(user, project, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));

		console.log("NEWUSR :", result);
		console.log("projects :", result.projects);
		console.log("typeof projects :", typeof result.projects);

		if (typeof result.projects == "undefined")
		{
		 	result.projects = [];
		}

		var ptp_stakeholder_result = calc_ptp_stk(project);

		var prj = new Object();
		prj.ptp_stakeholder_result = ptp_stakeholder_result;
		prj.data = project;
		prj.id = Math.random().toString(36).substr(2, 9);
		prj.calc_outcome = {
			ptp_stakeholders : ptp_stakeholder_result,
			ptp_reviewers: 0
		} 
		prj.review_tokens = [];
		prj.reviews = [];
		result.projects.push(prj);


		console.log("NEWUSR :", result);
		users.insert(result, user).then(
			function () 
			{ 
				var ret = "success";
				cb(prj); 
			});
		});
};

exports.addReviewer = addReviewer;
function addReviewer(user, projectid, cb) {
	users.get(user, function (err, result) {
		console.log("IN HERE");
		console.log("RESULT HERE :" + JSON.stringify(result));
		console.log("NEWUSR :", result);
		console.log("projects :", result.projects);
		console.log("typeof projects :", typeof result.projects);

		if (typeof result.projects == "undefined")
		{
		 	cb("error");
		}

		var found = false;
		var tk = Math.random().toString(36).substr(2, 9);
		var rv_token = {
			token : tk,
			registred_as : null
		}

		for (index in result.projects){
		if (result.projects[index].id == projectid)
		{
			result.projects[index].review_tokens.push(rv_token);
			found = true;
		}
		}

		if (!found)
		{
			cb("error");
		}


		console.log("NEWUSR :", result);
		users.insert(result, user).then(
			function () 
			{ 
				var ret = "success";
				cb(rv_token); 
			});
		});
};



exports.updatetoken = updtoken;
exports.get = function get(id, cb) {
	users.get(id, cb);
};

exports.authByToken = function get(token, ip, cb) {

	var retour = {
		valid: false,
		username: ""
	}
	const q = {
		selector: {
			tokenlist: { $elemMatch: { token: token } },
		},
		limit: 1
	};
	users.find(q).then((doc) => {
		console.log(doc);
		if (!doc.docs[0]) {
			cb(retour);
			return;
		}
		console.log("BEARER USER : " + doc.docs[0]._id);

		//detect token position
		var position = 0;
		doc.docs[0].tokenlist.forEach(function (element) {
			console.log(element);
			if (element.token == token)
				position = doc.docs[0].tokenlist.indexOf(element);
		});


		console.log("token position :" + position);


		var bearer = doc.docs[0]._id;
		var username = doc.docs[0]._id;


		var forever = doc.docs[0].tokenlist[position].forever;
		var expireDate = doc.docs[0].tokenlist[position].expire;
		var tokenIP = doc.docs[0].tokenlist[position].tokenip;
		var autorenew = doc.docs[0].tokenlist[position].autorenew;
		var renewduration = doc.docs[0].tokenlist[position].renewduration;

			console.log("date" + Math.round(new Date().getTime() / 1000));
			console.log("expire" + expireDate);

		if (!forever && Math.round(new Date().getTime() / 1000) > expireDate) {
			//delete expired token
			console.log("expired");
			console.log("date" + Math.round(new Date().getTime() / 1000));
			console.log("expire" + expireDate);
			doc.docs[0].tokenlist.splice(position, 1);

			var result = doc.docs[0];
			users.insert(result, bearer).then(function () {
				cb(retour);
				return;
			});
		}


		if (tokenIP != "nolink" && ip != tokenIP) {
			cb(retour);
			return;
		}


		retour.valid = true;
		retour.username = username;

		if (autorenew) {
			var result = doc.docs[0];
			result.tokenlist[position].expire = Math.round(new Date().getTime() / 1000) + renewduration;

			users.insert(result, bearer).then(function () {
				cb(retour);
				return;
			});
		}
		else {
			cb(retour);
			return;
		}
	});

	/*
  users.get(user, function (err, result) {
	  console.log("IN HERE");
	  console.log("RESULT HERE :" + JSON.stringify(result));

	  result.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	  result.tokenip = ip;
	  result.expire = Math.round(new Date().getTime()/1000) + expire;

	  users.insert(result, user, cb);

  });
  */
};

exports.comparepwd = function get(id, pwd, cb) {

	var crypto = require('crypto');
	var hash = crypto.createHash('whirlpool');
	//passing the data to be hashed
	data = hash.update(pwd, 'utf-8');
	//Creating the hash in the required format
	gen_hash = data.digest('hex');


	users.get(id, function (err, result) {
		console.log("result : " + JSON.stringify(result))
		if (!result || !result.password) {
			console.log("user not found or request problem")
			cb(err, false);
		}
		else {
			console.log("typeof valtoken : " + typeof result.validation_token)
			if (gen_hash == result.password && (typeof result.validation_token === 'undefined' || result.validation_token === '0' )) {
				console.log("pass ok")
				cb(err, true);
			}
			else {
				console.log("pass not ok")
				cb(err, false);
			}
		}
	});
};

exports.comparepwd_invoke = function get(id, pwd, cb) {

	var crypto = require('crypto');
	var hash = crypto.createHash('whirlpool');
	//passing the data to be hashed
	data = hash.update(pwd, 'utf-8');
	//Creating the hash in the required format
	gen_hash = data.digest('hex');


	users.get(id, function (err, result) {
		console.log("result : " + JSON.stringify(result))
		if (!result || !result.password) {
			console.log("user not found or request problem")
			cb(err, false);
		}
		else {
			if (gen_hash == result.password) {
				console.log("pass ok")
				cb(err, true);
			}
			else {
				console.log("pass not ok")
				cb(err, false);
			}
		}
	});
};






exports.comparepwd_pub = function get(id, pwd, cb) {

	var crypto = require('crypto');
	var hash = crypto.createHash('whirlpool');
	//passing the data to be hashed
	data = hash.update(pwd, 'utf-8');
	//Creating the hash in the required format
	gen_hash = data.digest('hex');

	var retu = {
		valid: false,
		pubkey: "",
	};

	users.get(id, function (err, result) {
		console.log("result : " + JSON.stringify(result))
		if (!result || !result.password) {
			console.log("user not found or request problem")
			cb(err, retu);
		}
		else {
			console.log("typeof valtoken : " + typeof result.validation_token)
			if (gen_hash == result.password && (typeof result.validation_token === 'undefined' || result.validation_token === '0' )) {
				console.log("pass ok")
				retu.pubkey = result.pubkey;
				retu.fulluser = result;
				retu.valid = true;
				cb(err, retu);
			}
			else {
				console.log("pass not ok")
				cb(err, retu);
			}
		}
	});
};