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
<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
  <title>Merchant App</title>
  <meta name="description" content="The HTML5 Herald">
  <meta name="author" content="SitePoint">

  <link rel="stylesheet" href="css/style.css">

</head>

<body>
<script src="js/script.js"></script>
<?php include "parts/header.php" ?>
<div id="maincontainer">

<h2>You can manage these shops :</h2>
<br>
<br>
<ul>
<?php

include "settings.php";
//
//Now calling API
//

$pk = getPubKey($login, $password);

$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/query_data");

$esc_pk = preg_quote ( $pk);
$esc_pk = str_replace('\\','\\\\',$esc_pk);
$esc_pk = sprintf("%s",$esc_pk);

$mango_query = '{"selector":{"DocType":"Shop","Users": { "$elemMatch" : {"$regex":".*'.$esc_pk.'.*"}}}}';
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json',
            "X-request-username: $login",
            "X-request-password: $password",
            "params: $mango_query"
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

if ($resp['status'] == "200")
{
}
else
{
    echo "failure, teh search has failed because : ".$resp["response"];
}

if (count($resp['response']) == 0)
{
  echo "No shops for this user<br>";
}

foreach ($resp['response'] as $key => $value)
{
  $pid = $value['Key'];
  $name = $value['Record']['Name'];
  ?>

    <a href="manage_sells.php?shop=<?php echo $pid?>&n=<?php echo $name?>">
        <li>
               <?php echo $name?> 
        </li>
    </a>

  <?php 
  } 
  ?>
</ul>


<br>
<br>
 <a href="manage_boug.php">
<p>Or click here to see the items you bouth in the past</p>
</a>

</div>
</body>
</html>
