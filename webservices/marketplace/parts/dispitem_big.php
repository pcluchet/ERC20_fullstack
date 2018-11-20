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

<div id="therest">

       <div id="details_big">
        <h2> Full item discription :</h2>
            The item description, this helps the custumer figuring out what he buys you know so that is a cool feature to have in a marketplace.
        </div>

<div id="about_seller">
    <h2> About the Seller :</h2>
    <p>
        Seller : uftV67ubHJh[...]BjhbH78ghvf3b<br>
        Score : 77 % or whatever<br>
    </p>
</div>
<div id="bid_history">
    <h2> Bid history :</h2>
    <p>
        Amount : 37 <br>
        By : uftVhjubHJh[...]BjhbH7890hvf3b<br>
    </p>
    <br>
    <p>
        Amount : 37 <br>
        By : uftV67ubHJh[...]BjhbH78ghvf3b<br>
    </p>
    <br>
    <p>
        Amount : 37 <br>
        By : uft789ubHJh[...]BjhbH78CDFTYUf3b<br>
    </p>
    <br>
    <p>
        Amount : 37 <br>
        By : uftV89YubHJh[...]BjhbH898YHhvf3b<br>
    </p>



</div>

</div>



</div>


