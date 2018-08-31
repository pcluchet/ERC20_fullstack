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
$parsedargs = json_encode($jsondata);
$parsedargs = "[".$parsedargs."]";

//print_r("parsed".$parsedargs);


//print_r($parsedargs);




//
//Now calling API
//

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/invoke");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "channel=ptwist&".
            "chaincode=facture&".
            "func=createBill&".
            "username=$login&".
            "password=$password&".
            "args=$parsedargs"
        );

// In real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS, 
//          http_build_query(array('postvar1' => 'value1')));

// Receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

curl_close ($ch);

$resp = json_decode($server_output, true);
var_dump($resp);

if ($resp['status'] == "200")
{
    echo $resp['payload'];
}
else
{
    echo "failure";
}

?>