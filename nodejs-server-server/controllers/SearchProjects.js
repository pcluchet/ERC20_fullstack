'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');
var users = require('../db/users');

module.exports.SearchProjects = function (req, res, next) {
  var search = req.swagger.params['X-request-search'].value;
  if (!search)
  search = "";
  console.log(search);
  var returned = []; 
  users.getProjectsForSearch(search, function (err, ret) {
    console.log("RESULT after search project:");
    console.log(ret);

    var regex = new RegExp(".*"+search+".*");
    if (ret.docs.length)
    {
      ret.docs.forEach(function (element) {
        element.projects.forEach(
          function (elem){
            if (elem.data.name.match(regex))
            {
            var pjnow = new Object();
            pjnow.owner = element._id;
            pjnow.owner_pubkey = element.pubkey;
            pjnow.body = elem;
            returned.push(pjnow);
            }
          }
        );
      })
    }

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(returned));
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Invalid reviewer token provided");
  });
};
