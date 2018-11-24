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
    <h2>Shop : <?php echo $_GET["n"] ?></h2>
    <br>
    <p><a href="adm.php">Back to shop list</a></p>
    <br>
<div id="contai">

    <div id="actionlist">

        <a href="manage_sells.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">

        <div id="actionitem">
            Selling       
        </div>
        </a>
         <a href="manage_pending.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">

        <div id="actionitem" class="">
            Pending 
        </div>
        </a>



        <a href="manage_sold.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">

        <div id="actionitem" class="selectedaction">
            Solds 
        </div>
        </a>
        <a href="manage_add.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">
        <div id="actionitem" >
            Add Item
        </div>
        </a>
   </div>
    <div id="actionfld">

<?php

include "settings.php";
//
//Now calling API
//

$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/query_data");

$mango_query = '{"selector":{"DocType":"Sale","ShopId":"'.$_GET["shop"].'"}}';
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

$sales = $resp['response'];

$ids = array();
foreach ($resp["response"] as $k => $v)
{
    $ids[] = $v["Record"]["ItemId"];
}

$ids = array_unique($ids);
$ids = array_values($ids);
//print_r($ids);

$jsonlist = json_encode($ids);

//echo "json=";
//print_r($jsonlist);



$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/query_data");

$mango_query = '{"selector":{"DocType":"ShopItem","_id": {"$in" : '.$jsonlist.' }}}';
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

$itms = array();
foreach ($resp["response"] as $k => $v)
{
    $itms[$v['Key']] = $v;
}
//print_r($itms);



//print_r($resp);

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
  echo "You have not sold anything right now";
}

foreach ($sales as $key => $value)
{
  $price = $value['Record']['Price'];
  $pid = $value['Record']['ItemId'];
  $name = $itms[$pid]['Record']['Name'];
  $picurl = $itms[$pid]['Record']['Picture'];
  $details = $itms[$pid]['Record']['Detail'];
  if (strlen($details) > 130)
  {
     $trimmed_details = substr($details,0,120)."[...]";
  }
  else
  {
     $trimmed_details = $details;
  }

  $bid_count = count($itms[$pid]['Record']['BidList']);
  $exp_tstamp = $itms[$pid]['Record']['ExpireDate'];
  $qtty = $value['Record']['Quantity'];
  $end_time = date('Y-m-d H:i:s', $exp_tstamp);
  $is_auction = $itms[$pid]['Record']['Biddable'];
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
   <div id="pricetag_s_sale">
    Unitary price : <?php echo $price ?> $ 
   </div>
   <div id="total_sale">
    Total transaction price : <?php echo $price*$qtty ?> $ 
   </div>

   <?php if ($bid){ ?> 
        <div id="bids_infos">
            <?php echo $bid_count ?> bids
        </div>
   <?php } ?> 
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
