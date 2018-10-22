var nano = require('nano');

module.exports = nano(process.env.COUCHDB_ADDR || 'http://127.0.0.1:5984');
