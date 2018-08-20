var request = require('request')

var url = 'http://127.0.0.1:5984/'
var db = 'mydatabaseff/'
var id = 'document_idff/'

    request(url + db + id, function(err, res, body) {
      console.log(err + '   ' + body.user + ' : ' + body.message)
    });
