'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');
var users = require('../db/users');

module.exports.GetProjectByToken = function (req, res, next) {
  var token = req.swagger.params['token'].value;
      users.getUsernameByReviewToken(token, function (err, ret) {
      console.log("RESRERSRERS:");
      console.log(ret);
      if (ret.docs.length == 0) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Invalid reviewer token provided");
      }

      for (var key in ret.docs[0].projects)
      {
          for (var key2 in ret.docs[0].projects[key].review_tokens)
          {
            if (ret.docs[0].projects[key].review_tokens[key2].token == token)
            {
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify(ret.docs[0].projects[key]));
            }
          }
      }
        res.writeHead(404, { "Content-Type": "text/plain" });
        return res.end("Invalid reviewer token provided");
    });
};
