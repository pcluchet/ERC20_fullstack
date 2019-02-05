<?php
// Start the session
session_start();
?>
<?php

//SETTINGS//
$APIURL = "http://api.plastictwist.com/";
$login = $_SESSION["username"];
$password = $_SESSION["password"];


//END SETTINGS//



//$parsedargs = json_encode($jsondata);
$parsedargs = $_GET['billid'];

//print_r($parsedargs);




//
//Now calling API
//


$channel = "ptwist";
$chaincode = "invoicing";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/get");
/*
curl_setopt($ch, CURLOPT_POSTFIELDS,
            "channel=ptwist&".
            "chaincode=invoicing&".
            "func=get&".
            "username=$login&".
            "password=$password&".
            "args=$parsedargs"
        );
        */
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            "X-request-username: $login",
            "X-request-password: $password",
            "params: $parsedargs"
        ));

// In real life you should use something like:
// curl_setopt($ch, CURLOPT_POSTFIELDS, 
//          http_build_query(array('postvar1' => 'value1')));

// Receive server response ...
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$server_output = curl_exec($ch);

//echo $server_output;

//echo $server_output;

curl_close ($ch);

$resp = json_decode($server_output, true);

if ($resp['status'] == "200" && $resp['response'] == "paid")
{
    echo "paid";
}
else
{
    echo "unpaid";
}

?>