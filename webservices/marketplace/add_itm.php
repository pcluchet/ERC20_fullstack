<?php
// Start the session
session_start();
if (!isset($_SESSION["username"]))
{

$newURL = "login.php";
header('Location: '.$newURL);
}
else
{
//print_r($_SESSION);

}
?>
<?php

include "settings.php";

//print_r($_POST);

$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/shop_add_item");

   if (isset($_POST["is_bid"]))
    {
         $Bidable = "true";
    }
    else
    {

         $Bidable = "false";
    }
	$Picture = $_POST["picurl"];
	$Name		 = $_POST["name"];
	$Detail	 = $_POST["desc"];
	$Price				 = $_POST["price"];
	$Quantity			 = $_POST["qtt"];
    $Duration			 = $_POST["duration"];

$jsobj = '{"Bidable" : '.$Bidable.', "Picture" : "'.$Picture.'", "Name" : "'.$Name.'" , "Detail" : "'.$Detail.'", "Quantity" : '.$Quantity.', "Duration" : '.$Duration.', "Price" : '.$Price.'}';

    //echo "OBJ=".$jsobj;
//print_r($_POST);
    /*
	Bidable				bool
	Picture				string
	Name				string
	Detail				string
	Price				uint64
	Quantity			uint64
    Duration			uint64
    */

$arf= $_POST['shop']."|".$jsobj;
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            "X-request-username: $login",
            "X-request-password: $password",
            "params: $arf"
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

//print_r($resp);

$newURL = "manage_sells.php?shop=".$_POST['shop']."&n=".$_POST['n'];
header('Location: '.$newURL);

?>