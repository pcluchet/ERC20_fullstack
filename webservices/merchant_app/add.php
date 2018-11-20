<?php
// Start the session
session_start();
?>
<?php
//print_r($_POST);

//echo urldecode($_POST['postdata']);
?>

<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Merchant App</title>
  <meta name="description" content="The HTML5 Herald">
  <meta name="author" content="SitePoint">

  <link rel="stylesheet" href="css/style.css">

</head>

<script src="js/add.js"></script>
<body onload="main()" >
    <span postdata="<?php echo $_POST['postdata']?>" id="postdataspan"></span>
<?php include "parts/header.php" ?>
<div id="maincontainer">
    <div id="invoiceprocessing">
        <ul id="processingsteps">
        </ul>
        <div id="processingactions">
        <button onclick="dje()">Cancel Invoice</button>
        <button onclick="continu()" id="continuebtn" disabled="true" >Continue</button>
        </div>
    </div>
</div>
</body>
</html>