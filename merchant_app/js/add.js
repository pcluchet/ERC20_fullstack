

var billid ="";

//contains interval
var myVar;

function main()
{


var list = document.getElementById("processingsteps");
    var encodeddata = document.getElementById("postdataspan").getAttribute("postdata");

    console.log("hello");
    list.innerHTML += '<li class ="processingstep">Sending invoice to the invoicing chaincode</li>';

    var http = new XMLHttpRequest();
    var url = 'createbill.php';
    var params = 'postdata='+ encodeddata;
    http.open('POST', url, true);
    
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4) {
            if (http.status == 200)
            {
            once_billid_received(http.responseText);
            }
            else
            {
    list.innerHTML += '<li class ="processingstep">Network failure, please retry</li>';
            }
        }
        else
        {


        }
    }
    http.send(params);

    console.log(encodeddata);
}

function once_billid_received (responseText) {

    
    var encodeddata = document.getElementById("postdataspan").getAttribute("postdata");
    var data = JSON.parse(decodeURIComponent(encodeddata));
    var total = data.total;


var list = document.getElementById("processingsteps");

if (responseText == "failure")
{
    list.innerHTML += '<li class ="processingstep">Invalid response from chaincode, aborting</li>';
}
else
{

    var shortid = responseText.substr(0, 5) + ' [...] '+responseText.substr(responseText.length - 5);
    list.innerHTML += '<li class ="processingstep">Received response from chaincode<br>Invoice has id '+shortid+'</li>';
    var bc = new BroadcastChannel('qrcode_channel');
    bc.postMessage('{ "total" : "'+ total +'", "billid" : "'+ responseText +'" }');
    billid = responseText;

    list.innerHTML += '<li class ="processingstep">Dislaying QRCode</li>';

    myVar = setInterval(myTimer, 1500);
    list.innerHTML += '<li class ="processingstep">Waiting for the user to pay</li>';
 
}


}

function myTimer() {
    console.log(billid);

var list = document.getElementById("processingsteps");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

       console.log(this.responseText);
       if (this.responseText == "paid")
       {
        list.innerHTML += '<li class ="processingstep">Bill has been paid✅, click continue to go on</li>';
        var ld = document.getElementById("continuebtn");
        ld.disabled = false;
        clearInterval(myVar);
       }
      }
    };
    xhttp.open("GET", "checkpaid.php?billid="+billid, true);
    xhttp.send();
}


function continu()
{
    window.location.href = "index.php";   
}