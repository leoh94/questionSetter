function startDataUpload() {
	alert ("start data upload");

	var name = document.getElementById("name").value;
	var surname = document.getElementById("surname").value;
	var module = document.getElementById("module").value;
	var question = document.getElementByID("question").value;
	var answer1 = document.getElementByID("answer1").value;
	var answer2 = document.getElementByID("answer2").value;
	var answer3 = document.getElementByID("answer3").value;
	var answer4 = document.getElementByID("answer4").value;
	
	
	var postString = "name="+name +"&surname="+surname+"&module="+module;
	postString = postString +"&question="+question+"&answer1="+answer1+"&answer2="+answer2+"&answer3="+answer3+"&answer4="+answer4;
	// now get the geometry values
	var latitude = document.getElementById("latitude").value;
	var longitude = document.getElementById("longitude").value;
	postString = postString + "&latitude=" + latitude + "&longitude=" + longitude;
	alert ("processing");
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