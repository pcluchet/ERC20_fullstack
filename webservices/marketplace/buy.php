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
    <h2>You will buy this item : </h2>
   <?php 
include "settings.php";
//
//Now calling API
//


$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/query_data");

$mango_query = '{"selector":{"DocType":"ShopItem","_id":{"$regex":".*'.$_GET["pid"].'.*"}}}';
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
  echo "Your search has returned no results<br>";
}

foreach ($resp['response'] as $key => $value)
{
  $price = $value['Record']['Price'];
  $pid = $value['Key'];
  $name = $value['Record']['Name'];
  $picurl = $value['Record']['Pictures'][0];
  $details = $value['Record']['Detail'];
  if (strlen($details) > 130)
  {
     $trimmed_details = substr($details,0,120)."[...]";
  }
  else
  {
     $trimmed_details = $details;
  }

  $bid_count = count($value['Record']['BidList']);
  $exp_tstamp = $value['Record']['ExpireDate'];
  $qtty = $value['Record']['Quantity'];
  $end_time = date('Y-m-d H:i:s', $exp_tstamp);
  $is_auction = $value['Record']['Biddable'];
  $bid = $is_auction;

  ?>

  <div id="item">

        <div id="itm_pic">

    <a href="itempage.php?pid=<?php echo $pid?>">
            <div class="container">
                <img src="<?php echo $picurl?>"/>
            </div>

    </a>
        </div>
    <div id="itm_infos">
        <div id="title">
            <?php echo $name?>
        </div>
        <div id="details">
            <?php echo $trimmed_details?>
        </div>
        <div id="end_of_offer">

            End <?php echo $end_time ?>
        </div>
        <div id="qtty">

            Quantity : <?php echo $qtty ?>
        </div>

        <div id="pricezone">
           <div id="pricetag">
            <?php echo $price ?> $ 
           </div>
       </div>
    </div>
</div>



  <?php 
  } 
  ?>


        <form action="buy_itm.php" method="post">
          <input type="hidden" name="shop" value="<?php echo $_GET['shop']?>">
          <input type="hidden" name="pid" value="<?php echo $_GET['pid']?>">
          <input type="text" name="qtt" placeholder="Quantity" size="10" id="field"><br>
          <input type="submit" value="Buy">
       </form> 

</div>



</div>
</body>
</html>
