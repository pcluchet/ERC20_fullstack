var couch = require('./couchdb');

couch.db.create('users', function(err) {  
  if (err) {
    console.error(err);
  }
});
