var express = require('express');
var app = express();
var router = express.Router();
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,token');
    //res.setHeader('*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



app.get('/', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("index.html", {"root": 'views'});
    });
	
app.get('/home', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("home.html", {"root": 'views'});
    });
	app.get('/friendlist', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("friendlist.html", {"root": 'views'});
    });
	app.get('/frienddetail', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("frienddetail.html", {"root": 'views'});
    });
// set the view engine to ejs
//app.set('view engine', 'js');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
 app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});
app.use("/public/js", express.static(__dirname + '/public/js'));

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});