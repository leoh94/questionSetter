//Adapted From: https://github.com/claireellul/cegeg077-week6formcode.git 
function startDataUpload() {
	alert ("start data upload");

	var site_location = document.getElementById("site_location").value;
	alert(site_location);
	
	var question = document.getElementById("question").value
	
	var postString = "site_location="+site_location +"&question="+question;
	
	var answer1 = document.getElementById("answer1").value;
	postString = postString + "&answer1="+answer1;
	
	var answer2 = document.getElementById("answer2").value;
	postString = postString + "&answer2="+answer2;
	var answer3 = document.getElementById("answer3").value;
	postString = postString + "&answer3="+answer3;
	var answer4 = document.getElementById("answer4").value;
	postString = postString + "&answer4="+answer4;
	
	var correct = document.getElementById("correct").value;
	postString = postString + "&correct="+correct;
	// now get the geometry values
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;
	
	processData(postString);

}

var client;

function processData(postString) {
   client = new XMLHttpRequest();
   client.open('POST','http://developer.cege.ucl.ac.uk:30263/uploadData',true);
   client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
   client.onreadystatechange = dataUploaded;  
   client.send(postString);
}
// create the code to wait for the response from the data server, and process the response once it is received
function dataUploaded() {
  // this function listens out for the server to say that the data is ready - i.e. has state 4
  if (client.readyState == 4) {
    // change the DIV to show the response
    document.getElementById("dataUploadResult").innerHTML = client.responseText;
    }
}