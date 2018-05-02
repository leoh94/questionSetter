// express is the server that forms part of the nodejs program
var express = require('express');
var https = require('https'); // used to create https services 
var fs = require('fs');   // fs = file system, to access files on the server
var app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	next();
});
// serve static files - e.g. html, css
app.use(express.static(__dirname));
var https = require('https');
var privateKey = fs.readFileSync('/home/studentuser/certs/client-key.pem').toString();
var certificate = fs.readFileSync('/home/studentuser/certs/client-cert.pem').toString();
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(4443);
app.get('/', function (req, res) {
	// run some server-side code here - e.g. connect to a database and get data
  
	// console.log types information out to the terminal window (server)
	console.log('the https server has received a request'); 
	
	// res.send sends text out to the browser (client)
	res.send('Hello World - this is an https server');
});

app.get('/getPOI', function (req,res) {
	pool.connect(function(err,client,done) {
		if(err){
			console.log("not able to get connection "+ err);
			res.status(400).send(err);
		}
		// use the inbuilt geoJSON functionality
		// and create the required geoJSON format using a query adapted from here: http://www.postgresonline.com/journal/archives/267-Creating-GeoJSON-FeatureCollections-with-JSON-and-PostGIS-functions.html,accessed 4th January 2018
		// note that query needs to be a single string with no line breaks so built it up bit by bit
		var querystring = " SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ";
		querystring = querystring + "(SELECT 'Feature' As type , ST_AsGeoJSON(lg.geom)::json As geometry, ";
		querystring = querystring + "row_to_json((SELECT l FROM (SELECT id, name, category) As l )) As properties";
		querystring = querystring + " FROM united_kingdom_poi As lg limit 100 ) As f ";
		console.log(querystring);
		client.query(querystring,function(err,result){
		//call `done()` to release the client back to the pool
		done();
		if(err){
			console.log(err);
			res.status(400).send(err);
		}
		res.status(200).send(result.rows);
		});
	});
});
