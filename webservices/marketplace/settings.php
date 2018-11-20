<?php

//SETTINGS//

$APIURL = "http://api.MEDSOS.example.com:8080";
$login = $_SESSION["username"];
$password = $_SESSION["password"];
//END SETTINGS//

function getPubKey($login, $password)
{
$APIURL = "http://api.MEDSOS.example.com:8080";
$login = $_SESSION["username"];
$password = $_SESSION["password"];


//
//Now calling API
//


$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/users/$login");

curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            "X-request-username: $login",
            "X-request-password: $password"
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

return $resp["pubkey"];
}

?>