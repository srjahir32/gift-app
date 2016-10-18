var express = require('express');
var app = express();
var router = express.Router();
var fbgraph = require('fbgraphapi');
var http = require('http');
var server = http.createServer(app);
var config = require('./configuration/config');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysql = require('mysql');
var FB=require('fb');
var FacebookStrategy = require('passport-facebook').Strategy;

var user=require('./api/user.js');

app.set('port', process.env.PORT || 8080);

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,accessToken');
    //res.setHeader('*');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid' }));

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    	res.sendFile("index.html", {"root": 'views'});
});
app.get('/home', function(req, res) {
    	res.sendFile("home.html", {"root": 'views'});
});
app.get('/friendlist', function(req, res) {
    	res.sendFile("friendlist.html", {"root": 'views'});
});
app.get('/frienddetail',function(req,res){
    	res.sendFile("frienddetail.html", {"root": 'views'});
});

app.post('/MyDetails',user.MyDetails);
app.post('/MyFrineds',user.Frienddata);
app.post('/selectFrineds',user.SelectedFriend);
app.post('/PrevselectedFrineds',user.PrevselectedFrineds);
app.post('/OwnDetails',user.OwnDetails);
//app.post('/getuser',user.user);
//app.post('/getFriend',user.getFriends);



app.use(express.static(__dirname + '/public'));
app.use("/public/js", express.static(__dirname + '/public/js'));
app.use("/assets/js", express.static(__dirname + '/assets/js'));
app.use("/assets/images", express.static(__dirname + '/assets/images'));
app.set('views', __dirname + '/views');


app.listen(app.get('port'));
console.log("VaboApi Started on Port No. ", app.get('port'));
