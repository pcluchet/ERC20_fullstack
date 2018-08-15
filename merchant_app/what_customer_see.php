<!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Customer Interface</title>
  <meta name="description" content="The HTML5 Herald">

  <link rel="stylesheet" href="css/style.css">

</head>
<script src="js/script.js"></script>
<script src="js/customer_iface.js"></script>
<script src="js/davidshimjs-qrcodejs/qrcode.js"></script>
<body onload="main()">


<div id="maincui">
    <div id="invoicetitle">
        Invoice #<span id="billid">XX</span>
    </div>
    <div id="invoiceInfos">
        Total Amount : <span id="totalamount">XX</span>€
    </div>

<div id="qrcodecontainer">
    <div id="qrcode">
    </div>
</div>
    <div id="invoiceInstructions">
        Scan this QR Code to pay
    </div>

</div>

</body>
</html>