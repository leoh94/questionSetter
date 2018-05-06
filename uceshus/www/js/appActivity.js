// the variables
// and a variable that will hold the layer itself – we need to do this outside the function so that we can use it to remove the layer later on 
var earthquakelayer;
// a global variable to hold the http request
var client;
// store the map
var mymap;

var testMarkerRed = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'red'
});

var testMarkerPink = L.AwesomeMarkers.icon({
	icon: 'play',
	markerColor: 'pink'
});

// this is the code that runs when the App starts

	loadMap();
	//showPointLineCircle();
	
		
		
// ***********************************
// the functions

function trackLocation() {
	alert("Tracking");
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
    } else {
		alert("geolocation is not supported by this browser");
    }
}
function showPosition(position) {
	// draw a point on the map
	L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap).bindPopup("<b>You were at "+ position.coords.longitude + " "+position.coords.latitude+"!</b>");mymap.setView([position.coords.latitude, position.coords.longitude], 13);
	}

function loadMap(){
		mymap = L.map('mapid').setView([51.505, -0.09], 13);
		// load the tiles
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'mapbox.streets'
		}).addTo(mymap);
}
// create a custom popup	
var popup = L.popup();

// create an event detector to wait for the user's click event and then use the popup to show them where they clicked
// note that you don't need to do any complicated maths to convert screen coordinates to real world coordiantes - the Leaflet API does this for you
function onMapClick(e) {
	popup
	.setLatLng(e.latlng)
	.setContent("You clicked the map at " + e.latlng.toString())
	.openOn(mymap);
	}
	// now add the click event detector to the map
	mymap.on('click', onMapClick);

function showPointLineCircle(){
	// add a point
	L.marker([51.5, -0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
	// add a circle
	L.circle([51.508, -0.11], 500, {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(mymap).bindPopup("I am a circle.");
	// add a polygon with 3 end points (i.e. a triangle)
	var myPolygon = L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
	],{
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5
	}).addTo(mymap).bindPopup("I am a polygon.");
}
		
		
	function loadEarthquakeData() {
	// call the getEarthquakes code
	// keep the alert message so that we know something is happening
	alert("Loading Data Points");
	getEarthquakes();
	}
   // create a variable that will hold the XMLHttpRequest() - this must be done outside a function so that all the functions can use the same variable
   var client;
   // create the code to get the Earthquakes data using an XMLHttpRequest
   function getEarthquakes() {
	client = new XMLHttpRequest();
	client.open('GET','http://developer.cege.ucl.ac.uk:30263/getGeoJSON/formdata/geom');
	client.onreadystatechange = earthquakeResponse; // note don't use earthquakeResponse() with brackets as that doesn't work
	client.send();
	}
   // create the code to wait for the response from the data server, and process the response once it is received
   function earthquakeResponse() {
	// this function listens out for the server to say that the data is ready - i.e. has state 4
	if (client.readyState == 4) {
		// once the data is ready, process the data
		var earthquakedata = client.responseText;
		loadEarthquakelayer(earthquakedata);
		}
   }
   // convert the received data - which is text - to JSON format and add it to the map
   function loadEarthquakelayer(earthquakedata) {
	// convert the text to JSON
	var earthquakejson = JSON.parse(earthquakedata);
	// add the JSON layer onto the map - it will appear using the default icons
	earthquakelayer = L.geoJson(earthquakejson).addTo(mymap);
	// change the map zoom so that all the data is shown
	mymap.fitBounds(earthquakelayer.getBounds());
	}