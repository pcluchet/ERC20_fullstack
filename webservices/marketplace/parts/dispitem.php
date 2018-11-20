<?php
$bid = true;
?>
<div id="item">

        <div id="itm_pic">

    <a href="itempage.php?pid=x">
            <div class="container">
                <img src="https://cdn-a.william-reed.com/var/wrbm_gb_food_pharma/storage/images/publications/food-beverage-nutrition/foodnavigator.com/article/2018/05/29/eu-commission-unveils-plans-to-tackle-plastic-waste/8239931-1-eng-GB/EU-Commission-unveils-plans-to-tackle-plastic-waste_wrbm_large.jpg"/>
            </div>

    </a>
        </div>
    <div id="itm_infos">
        <div id="title">
            The item Title
        </div>
        <div id="details">
            The item description, this helps the custumer figuring out what he buys you know so that is a cool feature to have in a marketplace.
        </div>
        <div id="end_of_offer">
            End Thuesday, 14 Nov at 13:12:11
        </div>
        <div id="pricezone">
           <div id="pricetag">
                83 $
           </div>
           <?php if ($bid){ ?> 
                <div id="bids_infos">
                    13 bids
                </div>
           <?php } ?> 
        </div>
           <?php if (!$bid){ ?> 
           <a href="buy.php?pid=x">
                <div id="buybtn">
                     Buy
                </div>
           </a>
           <?php } else { ?> 
            <form action="bid.php" method="get">
                <input name="amount" id="bid_amount" placeholder="Bid Amount" />
                <button id="buybtn">Bid</button>
            </form>

           <?php } ?> 
    </div>
</div>