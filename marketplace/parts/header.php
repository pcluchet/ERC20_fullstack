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

    <?php $logged = false ?>
    <?php if (!$logged) {?>
    <a href="login.php"> Login </a>
    <?php } else {?>
    <a href="logout.php"> <i class="fas fa-sign-out-alt"></i> Logout</a>
    <?php } ?>
</div>
</div>