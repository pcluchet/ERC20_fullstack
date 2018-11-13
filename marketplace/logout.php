<?php
// Start the session
session_start();
session_destroy();
$newURL = "login.php";
header('Location: '.$newURL);
?>

