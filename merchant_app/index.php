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

  <title>Merchant App</title>
  <meta name="description" content="The HTML5 Herald">
  <meta name="author" content="SitePoint">

  <link rel="stylesheet" href="css/style.css">

</head>

<body>
<?php echo $_SESSION["username"] ?>
<script src="js/script.js"></script>
<?php include "parts/header.php" ?>
<div id="maincontainer">

<!--
    <div id="ongoinginvoices">
        <ul>
         <li class="invoice" id="657bgkjh87yuhnIJKHU78YTFSZ">
             <div class="invoiceid">
             <button onclick="disp_qr('657bgkjh87yuhnIJKHU78YTFSZ')">Display</button> 
                 657bgkjh87yuhnIJKHU78YTFSZ
              </div>
              <div class="invoicetotal">
                  <span id="657bgkjh87yuhnIJKHU78YTFSZ_total">42</span>€
              </div>
        </li>
        <li class="invoice" id="54S365DR7FUTGIYHOJP">
             <div class="invoiceid">
             <button onclick="disp_qr('54S365DR7FUTGIYHOJP')">Display</button> 
                 54S365DR7FUTGIYHOJP
              </div>
              <div class="invoicetotal">
                  <span id="54S365DR7FUTGIYHOJP_total">12</span>€
              </div>
        </li>
        <li class="invoice displayedinvoice" id="6RDFGUHIJKMLJHGFY">
             o<div class="invoiceid">
             <button onclick="disp_qr('6RDFGUHIJKMLJHGFY')">Display</button> 
                    6RDFGUHIJKMLJHGFY
              </div>
              <div class="invoicetotal">
                  <span id="6RDFGUHIJKMLJHGFY_total">22</span>€
              </div>
        </li>
                    </ul>
    <button onclick="customer_interface()">Open customer interface</button>
    </div>
-->
    <div id="addinvoice">
        <div id="invoiceeditor">
            <div id="invoice">
                <div id="products">
                    <ul id="invoicelist">
                    </ul>
                </div>
                <div id="total">
                    Grand Total : <span id="grand">0</span>€
                </div>
            </div>

        <div id="editorcontrol">
            Product : 
            <select name="food" id="selectedproduct" >
               <option price="2" value="banana">Banana</option>
                <option price="5" value="sandwich">Sandwich</option>
                 <option price="2" value="icecream">Ice cream</option>
                  <option price="3" value="salad">Salad</option>
            </select> 
            <button onclick="dje()">Add to invoice</button><br>
            <button onclick="resetInvoice()">Reset invoice</button>

    <button onclick="customer_interface()">Open customer interface</button>
        </div>
        </div>
            <div id="submit">
                <form action="./add.php" method="post">
                <input name="postdata" type="hidden" value="" id="postdata">
                <input type="submit" value="Create Invoice" id="submit">
                </form>
            </div>
    </div>

</div>
</body>
</html>
