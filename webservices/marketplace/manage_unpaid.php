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
    $logged = true;
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
    <br><br>
    <h2>Bought items :</h2>
    <br>
    <br>
<div id="contai">
    <div id="actionlist">
       <a href="manage_boug.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">
            <div id="actionitem" class="">
                Boughts 
            </div>
        </a>
       <a href="manage_unpaid.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">
            <div id="actionitem" class="selectedaction">
                Unpaid 
            </div>
        </a>
   </div>
    <div id="actionfld">

<?php

include "settings.php";
//
//Now calling API
//


$pk = getPubKey($login, $password);

$esc_pk = preg_quote ( $pk);
$esc_pk = str_replace('\\','\\\\',$esc_pk);
$esc_pk = sprintf("%s",$esc_pk);

//echo $esc_pk;


$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/query_data");


$now = time();
$mango_query = '{"selector":{"DocType":"ShopItem","ExpireDate":{"$lt":'.$now.'}, "Winner": { "$regex" : ".*'.$esc_pk.'.*"}, "Quantity" : { "$ne" :  0} }}';
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

if ($resp['status'] == "200")
{
}
else
{
    echo "failure, teh search has failed because : ".$resp["response"];
}

if (count($resp['response']) == 0)
{
  echo "You have no unpaid items right now";
}

foreach ($resp['response'] as $key => $value)
{
  $price = $value['Record']['Price'];
  $pid = $value['Key'];
  $name = $value['Record']['Name'];
  $picurl = $value['Record']['Picture'];
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
<div id="item_s">

<div id="itm_pic">

<a href="itempage.php?pid=<?php echo $pid?>">
    <div class="container_s">
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
<div id="qtty_s">

    Quantity : <?php echo $qtty ?>
</div>

<div id="pricezone">
   <div id="pricetag_s">
    <?php echo $price ?> $ 
   </div>
   <?php if ($bid){ ?> 
        <div id="bids_infos">
            <?php echo $bid_count ?> bids
        </div>
   <?php } ?> 
       <a href="settle_bid.php?pid=<?php echo $pid?>&shop=<?php echo $shopid?>">
                <div id="buybtn">
                     Pay
                </div>
           </a>


</div>

</div>
</div>



<?php 
} 
?>




    </div>
</div>



</div>
</body>
</html>
