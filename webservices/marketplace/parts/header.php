<?php date_default_timezone_set('UTC'); ?>
<div id="header">
<div id="logo">
Plastic Bay
</div>

<div id="search">
    <form action="search.php" method="get">
    <input type="search" id="search" placeholder="Search..." name="s"/>
    <button class="icon"><i class="fa fa-search"></i></button>
</form>
</div>

<div id="logout">

    <?php if (!isset($_SESSION["username"])) {?>
    <a href="login.php"> Login </a>
    <?php } else { echo "Logged in as : ".$_SESSION["username"]?>
    <a href="adm.php"> <i class="fas fa-user"></i> &nbsp;&nbsp;&nbsp;</a>
    <a href="logout.php"> <i class="fas fa-sign-out-alt"></i> &nbsp;&nbsp;&nbsp;</a>

    <?php } ?>
</div>
</div>