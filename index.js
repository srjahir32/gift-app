var express = require('express');
var app = express();
var router = express.Router();

app.set('port', process.env.PORT || 9000);

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


//******** Admin Panel *********//
router.get('/',function(req,res){
	  //res.header("Access-Control-Allow-Origin", "*");
	  res.sendFile("index.html", {"root": 'views'});
});

app.get('/admin', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("index.html", {"root": ''});
    });
app.get('/Home', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("index.dev.html", {"root": 'app'});
    });

app.get('/pages/Forgotpassword', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("Forgotpassword.html", {"root": 'app/pages'});
    });

app.get('/pages/otp', function(req, res) {
       	// load the single view file (angular will handle the page changes on the front-end)
    	res.sendFile("otp.html", {"root": 'app/pages'});
    });

app.use('/', router);
app.use("/app", express.static(__dirname + '/app'));
app.use("/Home", express.static(__dirname + '/app'));
app.use("/bower_components", express.static(__dirname + '/app/bower_components'));
app.use("/app/fonts", express.static(__dirname + '/app/assets/fonts'));
app.use("/Home/fonts", express.static(__dirname + '/app/assets/fonts'));
app.use("/Home/img", express.static(__dirname + '/app/assets/img'));
app.use("/assets", express.static(__dirname + '/app/assets'));
app.use("/fonts", express.static(__dirname + '/app/assets/fonts'));
app.use("/assets/css", express.static(__dirname + '/app/assets/css'));

/*
app.use('/img',express.static(path.join(__dirname, '/app/assets/img')));
app.use('/js',express.static(path.join(__dirname, 'app/assets/js')));
app.use('/css',express.static(path.join(__dirname, 'app/assets/css')));
*/
//******** End Admin Panel ******//


app.listen(app.get('port'));
console.log("VaboApi Started on Port No. ",app.get('port'));
