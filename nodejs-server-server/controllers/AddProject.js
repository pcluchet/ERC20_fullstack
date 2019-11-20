'use strict';

var utils = require('../utils/writer.js');
var Query = require('../service/QueryService');


var users = require('../db/users');


module.exports.AddProject = function (req, res, next) {
  var username = req.swagger.params['username'].value;
  var xRequestPassword = req.swagger.params['X-request-password'].value;
  var xRequestUseToken = req.swagger.params['X-request-use-token'].value;
  var xRequestToken = req.swagger.params['X-request-token'].value;
  var projectdata = req.swagger.params['X-request-project'].value;
  var projectschema = 


  {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
      "name": {
        "type": "string"
      },
      "description": {
        "type": "string"
      },
      "plastic_category": {
        "type": "string"
      },
      "AmountOfPlasticRemoved": {
        "type": "integer"
      },
      "DurationOfTheCycle": {
        "type": "integer"
      },
      "Stage": {
        "type": "integer"
      },
      "InitialMaterialData": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "PlasticCategory": {
                "type": "object",
                "properties": {
                  "PETEorPET": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "HDPE": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "PVC": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "LDPE": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "PP": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "SP": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  }
                },
                "required": [
                  "PETEorPET",
                  "HDPE",
                  "PVC",
                  "LDPE",
                  "PP",
                  "SP"
                ]
              },
              "Amount": {
                "type": "integer"
              }
            },
            "required": [
              "name",
              "PlasticCategory",
              "Amount"
            ]
          },
          {
            "type": "object",
            "properties": {
              "name": {
                "type": "string"
              },
              "PlasticCategory": {
                "type": "object",
                "properties": {
                  "PETEorPET": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "HDPE": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "PVC": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "LDPE": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "PP": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  },
                  "SP": {
                    "type": "object",
                    "properties": {
                      "present": {
                        "type": "boolean"
                      }
                    },
                    "required": [
                      "present"
                    ]
                  }
                },
                "required": [
                  "PETEorPET",
                  "HDPE",
                  "PVC",
                  "LDPE",
                  "PP",
                  "SP"
                ]
              },
              "Amount": {
                "type": "integer"
              }
            },
            "required": [
              "name",
              "PlasticCategory",
              "Amount"
            ]
          }
        ]
      },
      "StakeHoldersEvaluations": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "People": {
                "type": "number"
              },
              "Innovation": {
                "type": "number"
              },
              "Material": {
                "type": "number"
              },
              "Transport": {
                "type": "number"
              },
              "Impact": {
                "type": "number"
              }
            },
            "required": [
              "People",
              "Innovation",
              "Material",
              "Transport",
              "Impact"
            ]
          },
          {
            "type": "object",
            "properties": {
              "People": {
                "type": "number"
              },
              "Innovation": {
                "type": "number"
              },
              "Material": {
                "type": "number"
              },
              "Transport": {
                "type": "number"
              },
              "Impact": {
                "type": "number"
              }
            },
            "required": [
              "People",
              "Innovation",
              "Material",
              "Transport",
              "Impact"
            ]
          },
          {
            "type": "object",
            "properties": {
              "People": {
                "type": "number"
              },
              "Innovation": {
                "type": "number"
              },
              "Material": {
                "type": "number"
              },
              "Transport": {
                "type": "number"
              },
              "Impact": {
                "type": "number"
              }
            },
            "required": [
              "People",
              "Innovation",
              "Material",
              "Transport",
              "Impact"
            ]
          },
          {
            "type": "object",
            "properties": {
              "People": {
                "type": "number"
              },
              "Innovation": {
                "type": "number"
              },
              "Material": {
                "type": "number"
              },
              "Transport": {
                "type": "number"
              },
              "Impact": {
                "type": "number"
              }
            },
            "required": [
              "People",
              "Innovation",
              "Material",
              "Transport",
              "Impact"
            ]
          },
          {
            "type": "object",
            "properties": {
              "People": {
                "type": "number"
              },
              "Innovation": {
                "type": "number"
              },
              "Material": {
                "type": "number"
              },
              "Transport": {
                "type": "number"
              },
              "Impact": {
                "type": "number"
              }
            },
            "required": [
              "People",
              "Innovation",
              "Material",
              "Transport",
              "Impact"
            ]
          }
        ]
      },
      "InnovationData": {
        "type": "object",
        "properties": {
          "CanBeCopied": {
            "type": "boolean"
          },
          "EasilyCommunicated": {
            "type": "boolean"
          },
          "BeenDoneBefore": {
            "type": "boolean"
          }
        },
        "required": [
          "CanBeCopied",
          "EasilyCommunicated",
          "BeenDoneBefore"
        ]
      },
      "TransportData": {
        "type": "object",
        "properties": {
          "NoFueledVehicle": {
            "type": "integer"
          },
          "ElectricVehicle": {
            "type": "integer"
          },
          "GasVehicle": {
            "type": "integer"
          },
          "Hybrid": {
            "type": "integer"
          },
          "PublicTransport": {
            "type": "integer"
          },
          "DieselVehicle": {
            "type": "integer"
          },
          "SeaFreight": {
            "type": "integer"
          },
          "AirFreight": {
            "type": "integer"
          }
        },
        "required": [
          "NoFueledVehicle",
          "ElectricVehicle",
          "GasVehicle",
          "Hybrid",
          "PublicTransport",
          "DieselVehicle",
          "SeaFreight",
          "AirFreight"
        ]
      },
      "MaterialData": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "infos": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "integer"
                  },
                  "misc": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "amount",
                  "misc"
                ]
              },
              "PETEorPET": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "HDPE": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "PVC": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "LDPE": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "PP": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "SP": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              }
            },
            "required": [
              "infos",
              "PETEorPET",
              "HDPE",
              "PVC",
              "LDPE",
              "PP",
              "SP"
            ]
          },
          {
            "type": "object",
            "properties": {
              "infos": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "integer"
                  },
                  "misc": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "amount",
                  "misc"
                ]
              },
              "PETEorPET": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "HDPE": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "PVC": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "LDPE": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "PP": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "SP": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              }
            },
            "required": [
              "infos",
              "PETEorPET",
              "HDPE",
              "PVC",
              "LDPE",
              "PP",
              "SP"
            ]
          },
          {
            "type": "object",
            "properties": {
              "infos": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string"
                  },
                  "amount": {
                    "type": "integer"
                  },
                  "misc": {
                    "type": "string"
                  }
                },
                "required": [
                  "name",
                  "amount",
                  "misc"
                ]
              },
              "PETEorPET": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "HDPE": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "PVC": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "LDPE": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "PP": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              },
              "SP": {
                "type": "object",
                "properties": {
                  "present": {
                    "type": "boolean"
                  },
                  "Recyclability": {
                    "type": "integer"
                  }
                },
                "required": [
                  "present",
                  "Recyclability"
                ]
              }
            },
            "required": [
              "infos",
              "PETEorPET",
              "HDPE",
              "PVC",
              "LDPE",
              "PP",
              "SP"
            ]
          }
        ]
      },
      "PeoplesData": {
        "type": "array",
        "items": [
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          },
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          },
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          },
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          },
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          },
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          },
          {
            "type": "object",
            "properties": {
              "PeoplesCategory": {
                "type": "string"
              },
              "Count": {
                "type": "integer"
              }
            },
            "required": [
              "PeoplesCategory",
              "Count"
            ]
          }
        ]
      }
    },
    "required": [
      "name",
      "description",
      "plastic_category",
      "AmountOfPlasticRemoved",
      "DurationOfTheCycle",
      "Stage",
      "InitialMaterialData",
      "StakeHoldersEvaluations",
      "InnovationData",
      "TransportData",
      "MaterialData",
      "PeoplesData"
    ]
  };


  
  if (typeof projectdata !== 'undefined')
  {
    try {
    var projectobj  = JSON.parse(projectdata);
    }
 catch (e) {
  if (e instanceof SyntaxError) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("project data must be a correctly formated JSON string");
  }
  }

  //var projectobj  = JSON.parse(projectdata);
  //var validate = require('jsonschema').validate;

  var Validator = require('jsonschema').Validator;
  var v = new Validator();

  var prj = v.validate(projectobj, projectschema);

  if ( prj != "" )
  {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("project data is not correctly formated : " + prj);
  }
  /*
  else 
  {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("valid data correctly formated! ");
  }
  */
}
  if (xRequestUseToken)
  {
    var clientIP = req.connection.remoteAddress;
    console.log("USING TOKEN AUTH");
    //users.updatetoken("jx",clientIP,expire,function (){console.log("CALLBACK")});
    users.authByToken(xRequestToken, clientIP, function (retu){
      console.log("CALLBACK 2 valid :" + retu);
      if (!retu.valid)
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Invalid/Expired token provided");
      }
      else
      {
            console.log('succesfully identified');
            users.addproject(retu.username, projectobj, function (retz){

            console.log(retz);
            console.log("mouai");

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(retz));

           });
      }
    })
  }
  else
  {
  users.comparepwd(username, xRequestPassword, function (err, result) {
    if (err) {

        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
		//returnResponse(res, 403, "Username or password invalid");
        //res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      //throw err;
    }
    else {
      console.log('user :' + JSON.stringify(result));
      if (result) {
        console.log('succesfully identified');
            users.addproject(username, projectobj, function cb(ret){
            console.log(result);
            console.log(ret);
            console.log("mouai");
            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify(ret));
            });
            console.log("ici");
      }
      else
      {
        res.writeHead(401, { "Content-Type": "text/plain" });
        return res.end("Unauthorized");
	//	returnResponse(res, 403, "Username or password invalid");
		//res.send('{"status" : 403, "payload" : "", "message" : "Username or password invalid" }');
      }
    }
  });

  /*
  Query.query(xRequestUsername,xRequestPassword,channel,chaincode,_function,params)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
    */
  }
};
