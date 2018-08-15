<?php
// Start the session
session_start();

$_SESSION["username"] = $_POST["uname"];
$_SESSION["password"] = $_POST["psw"];

$newURL = "index.php";
header('Location: '.$newURL);
?>
