'use strict';

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
	  https = require('https');
// Certificate
const privateKey = fs.readFileSync(path.join(__dirname, '/_certs/privkey1.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '/_certs/cert1.pem'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, '/_certs/chain1.pem'), 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

var app = require('connect')();
var cors = require('cors');
var serveStatic = require('serve-static');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var serverPort = 80;

app.use(cors());
app.use(serveStatic("public"));
app.use("/cc_docs",serveStatic(path.join(__dirname, '/api_doc')))
app.use("/img/cropped-ptwist_logo_small.png",serveStatic(path.join(__dirname, '/img/cropped-ptwist_logo_small.png')))
app.use("/img/European_Commission.png",serveStatic(path.join(__dirname, '/img/European_Commission.png')))
app.use("/img/facebook_circle.png",serveStatic(path.join(__dirname, '/img/facebook_circle.png')))
app.use("/img/monetization_icon.png",serveStatic(path.join(__dirname, '/img/monetization_icon.png')))
app.use("/img/twitter_PNG39.png",serveStatic(path.join(__dirname, '/img/twitter_PNG39.png')))
//app.use(serveStatic("public/api_doc"));
//app.use('/cc_docs', app.static(__dirname + '/api_doc'))

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

  const httpsServer = https.createServer(credentials, app);
  
  httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
  });

});
