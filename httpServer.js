// express is the server that forms part of the nodejs program
var express = require('express');
var path = require("path");
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

	// adding functionality to allow cross-domain queries when PhoneGap is running a server
	app.use(function(req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
		res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		next();
	});

	
	// adding functionality to log the requests
	app.use(function (req, res, next) {
		var filename = path.basename(req.url);
		var extension = path.extname(filename);
		console.log("The file " + filename + " was requested.");
		next();
	});
		
	
	// add an http server to serve files to the Edge browser 
	// due to certificate issues it rejects the https files if they are not
	// directly called in a typed URL
	var http = require('http');
	var httpServer = http.createServer(app); 
	httpServer.listen(4480);
	
	
	// read in the file and force it to be a string by adding “” at the beginning
	var configtext =""+ fs.readFileSync('/home/studentuser/certs/postGISConnection.js');
	// now convert the configuration file into the correct format -i.e. a name/value pair array
	var configarray = configtext.split(",");
	var config = {};
	for (var i = 0; i < configarray.length; i++) {
		var split = configarray[i].split(':');
		config[split[0].trim()] = split[1].trim();
	}
	//Import required connectivity code and set up database connection
	var pg = require('pg');
	var pool = new pg.Pool(config);
	console.log(config);
	
	/*var geometrystring = "st_geomfromtext('POINT(" + req.body.longitude + " " + req.body.latitude + ")'";
	var querystring = "INSERT into formdata (name,surname,module,language, modulelist,lecturetime, geom) values ('";
	querystring = querystring + req.body.name + "','" + req.body.surname + "','" + req.body.module + "','";
	querystring = querystring + req.body.language + "','" + req.body.modulelist + "','" + req.body.lecturetime+"',"+geometrystring + "))";
	console.log(querystring);
	client.query( querystring,function(err,result) {
		done();
		if(err){
			console.log(err);
			res.status(400).send(err);
        }
		res.status(200).send("row inserted");
		});*/
	// pull the geometry component together
	// note that well known text requires the points as longitude/latitude !
	// well known text should look like: 'POINT(-71.064544 42.28787)'

	//Add a simple app.get to test connection
	app.get('postgistest', function (req,res) {
		pool.connect(function(err,client,done) {
			if(err){
				console.log("not able to get connection "+ err);
				res.status(400).send(err);
			}
			client.query('SELECT name FROM formdata',function(err,result) {
				console.log("query");
				done();
				if(err){
					console.log(err);
					res.status(400).send(err);
				}
				res.status(200).send(result.rows);
			});
		});
	});
	
	app.post("/uploadData",function(req,res){
	// note that we are using POST here as we are uploading data
	// so the parameters form part of the BODY of the request rather than the RESTful API
	console.dir(req.body);
	res.send(req.body);
	});
	
	// the / indicates the path that you type into the server - in this case, what happens when you type in:  http://developer.cege.ucl.ac.uk:32560/xxxxx/xxxxx
	app.get("/index.html", function (req, res) {
	// run some server-side code
	// the console is the command line of your server - you will see the console.log values in the terminal window
	console.log("request "+req.params.name1);
	// the res is the response that the server sends back to the browser - you will see this text in your browser window
	res.sendFile(__dirname + '/'+req.params.name1);
	});
	
	app.get("/:name1/:name2", function (req, res) {
	console.log("request "+req.params.name1+"/"+req.params.name2);
	res.sendFile(__dirname + "/"+req.params.name1+"/"+req.params.name2);
	});
	
	app.get('/:name1/:name2/:name3', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3); 
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3);
	});
	
	app.get('/:name1/:name2/:name3/:name4', function (req, res) {
	console.log('request '+req.params.name1+"/"+req.params.name2+"/"+req.params.name3+"/"+req.params.name4); 
	res.sendFile(__dirname + '/'+req.params.name1+'/'+req.params.name2+ '/'+req.params.name3+"/"+req.params.name4);
	});