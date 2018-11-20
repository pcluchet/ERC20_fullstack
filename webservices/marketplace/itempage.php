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

$value = $resp['response'][0];

  $price = $value['Record']['Price'];
  $pid = $value['Key'];
  $name = $value['Record']['Name'];
  $picurl = $value['Record']['Picture'];
  $details = $value['Record']['Detail'];
  $shopid = $value['Record']['ShopId'];
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


$channel = "ptwist";
$chaincode = "marketplace";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,$APIURL."/ledger/$channel/$chaincode/query_data");

$mango_query = '{"selector":{"DocType":"Bid","ItemId":{"$regex":".*'.$_GET["pid"].'.*"}}}';
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

$bidlist = $resp['response'];


function sortByDate($a, $b)
{
    $a = $a['Timestamp'];
    $b = $b['Timestamp'];

    if ($a == $b) return 0;
    return ($a < $b) ? -1 : 1;
}




$simple = array();
foreach ($bidlist as $k => $v)
{
    $v['Record']['Key'] = $v['Key'];
    $simple[] = $v['Record'];
}

usort($simple, 'sortByDate');

?>

<div id="item">

        <div id="itm_pic">

    <a href="itempage.php?pid=<?php echo $pid?>&shop=<?php echo $shopid?>">
            <div class="container">
                <img src="<?php echo $picurl?>"/>
            </div>

    </a>
        </div>
    <div id="itm_infos">
        <div id="title">
            <?php echo $name?>
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
           <?php if ($bid){ ?> 
                <div id="bids_infos">
                    <?php echo $bid_count ?> bids
                </div>
           <?php } ?> 
        </div>
           <?php if (!$bid){ ?> 
           <a href="buy.php?pid=<?php echo $pid?>&shop=<?php echo $shopid?>">
                <div id="buybtn">
                     Buy
                </div>
           </a>
           <?php } else { ?> 
            <form action="bid.php" method="get">
                <input name="amount" id="bid_amount" placeholder="Bid Amount" />
                <input name="pid" type="hidden" value="<?php echo $pid?>" />
                <button id="buybtn">Bid</button>
            </form>

           <?php } ?> 
    </div>
</div>


<div id="therest">

       <div id="details_big">
        <h2> Full item discription :</h2>
        <?php echo $details?>
        </div>

<div id="about_seller">
    <h2> About the Seller :</h2>
    <p>
        Seller : uftV67ubHJh[...]BjhbH78ghvf3b<br>
        Score : 77 % or whatever<br>
    </p>
</div>
<div id="bid_history">


    <h2> Bid history :</h2>
    <?php
    foreach($simple as $key => $value)
    {
    ?>
    <p>
        Amount : <?php echo $value['ShownPrice']?> <br>
        By : <?php echo $value['Owner']?><br>

        Date : <?php echo date('Y-m-d H:i:s', $value['Timestamp']) ?><br>
        <?php if (strpos($value['Key'],"auto") !== false) { ?>
        Autobid<br>
        <?php } ?>
    </p>
    <br>

    <?php }  ?>

</div>

</div>



</div>



</div>
</body>
</html>
