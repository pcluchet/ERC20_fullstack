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
    <br><br>
    <h2>Shop : <?php echo $_GET["n"] ?></h2>
    <br>
    <p><a href="adm.php">Back to shop list</a></p>
    <br>



<div id="contai">
    <div id="actionlist">

        <a href="manage_sells.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">
        <div id="actionitem" >
            Selling       
        </div>
        </a>

        <a href="manage_sold.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">
        <div id="actionitem">
            Solds 
        </div>
        </a>
        <a href="manage_add.php<?php echo "?shop=".$_GET['shop']."&n=".$_GET['n']?>">
        <div id="actionitem" class="selectedaction">
            Add item
        </div>
        </a>

    </div>
    <div id="actionfld">
        <form action="add_itm.php" method="post">
          <input type="text" name="name" placeholder="Item Name" size="40" id="field"><br>
          <input type="hidden" name="shop" value="<?php echo $_GET['shop']?>">
          <input type="hidden" name="name" value="<?php echo $_GET['n']?>">
          <input type="text" name="picurl" placeholder="Picture url" size="40" id="field"><br>
          <input type="text" name="price" placeholder="Price" size="10" id="field"><br>
          <input type="text" name="qtt" placeholder="Quantity" size="10" id="field"><br>
          <input type="text" name="duration" placeholder="Duration (hours)" size="15" id="field"><br>
          <input type="checkbox" name="is_bid" value ="true" /> Auction<br><br>
          <textarea name="desc" rows="10" cols="60" placeholder="Item description"></textarea><br><br> 
          <input type="submit" value="Submit">
       </form> 

    </div>
</div>



</div>
</body>
</html>
