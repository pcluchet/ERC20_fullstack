<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// Start the session
session_start();
?>
<?php

//SETTINGS//
$APIURL = "http://api.MEDSOS.example.com:8080";
$login = $_SESSION["username"];
$password = $_SESSION["password"];


//END SETTINGS//


$json = urldecode($_POST['postdata']);

$data = json_decode($json, true);
$justlist = $data["products"];

$plist = array();
foreach ($justlist as $key => $value)
{
    $value["Count"] = 1;
    $plist[] = $value;
}

$jsondata = json_encode($plist);

//print_r($jsondata);


$args = array();
//$args[] = addslashes($jsondata);

//print_r("uesh".$jsondata);
$parsedargs = $jsondata;
//$parsedargs = "[".$parsedargs."]";

//print_r("parsed".$parsedargs);


//print_r($parsedargs);



$channel = "ptwist";
$chaincode = "invoicing";

//
//Now calling API
//

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/createBill");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    "X-request-username: $login",
    "X-request-password: $password",
    "params: $parsedargs"
));

/*
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "username=$login&".
            "password=$password&".
            "args=$parsedargs"
        );
*/

// Receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close ($ch);

error_log($server_output);
error_log($parsedargs);

$resp = json_decode($server_output, true);

if ($resp['status'] == "200")
{
    echo $resp['payload'];
}
else
{
    echo "failure";
}

?>