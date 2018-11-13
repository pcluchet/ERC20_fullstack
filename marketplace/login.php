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

  <title>Merchant App - Login</title>
  <meta name="description" content="The HTML5 Herald">
  <meta name="author" content="SitePoint">

  <link rel="stylesheet" href="css/style.css">

</head>
<body >
    <div id="login">
<form action="login_process.php" method="post" >
    <label for="uname"><b>_Username</b></label>
    <input type="text" placeholder="Enter Username" name="uname" required>
    <br>
    <label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="psw" required>
    <br>
    <button type="submit">Login</button>

</form> 
</div>
</div>
</body>
</html>