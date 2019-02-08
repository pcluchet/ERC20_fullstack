#! /bin/bash

#create 6 users
u1="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user7/auth' | jq -r '.pubkey')"

u2="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user8/auth' | jq -r '.pubkey')"

u3="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user9/auth' | jq -r '.pubkey')"

u4="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user10/auth' | jq -r '.pubkey')"

u5="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user11/auth' | jq -r '.pubkey')"

u6="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:80/users/user12/auth' | jq -r '.pubkey')"


echo "Public keys:";
echo "User1:$u1";
echo "User2:$u2";
echo "User3:$u3";
echo "User4:$u4";
echo "User5:$u5";
echo "User6:$u6";

#each user register their name

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/marketplace/new_user'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/marketplace/new_user'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user9' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/marketplace/new_user'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user10' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/marketplace/new_user'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user11' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/marketplace/new_user'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user12' --header 'X-request-password: cbpassword' --header 'params: 0' 'http://localhost:80/ledger/ptwist/marketplace/new_user'

#each user receive 100 tokens from centralbank

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u1"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u2"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'



curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u3"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u4"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u5"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: '"$u6"'|100|Initial Dotation' 'http://localhost:80/ledger/ptwist/ERC20/transfer'


#each user create a shop

u1_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: The basket shop|'"$u1" 'http://localhost:80/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u2_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: Tiles shop|'"$u2"  'http://localhost:80/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u3_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user9' --header 'X-request-password: cbpassword' --header 'params: myshop|'"$u3"  'http://localhost:80/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u4_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user10' --header 'X-request-password: cbpassword' --header 'params: myshop|'"$u4"  'http://localhost:80/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"


u5_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user11' --header 'X-request-password: cbpassword' --header 'params: myshop|'"$u5"  'http://localhost:80/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u6_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user12' --header 'X-request-password: cbpassword' --header 'params: myshop|'"$u6"  'http://localhost:80/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

echo "Shop addresses:";
echo "User1:$u1_shop";
echo "User2:$u2_shop";
echo "User3:$u3_shop";
echo "User4:$u4_shop";
echo "User5:$u5_shop";
echo "User6:$u6_shop";




#user 1 create some baskets

curl -v -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: '"$u1_shop"'|{"Bidable":false,"Pictures":["https://picoolio.net/images/2018/11/13/basket3_result301871c2667cd6f8.jpg"],"Name":"Blue basket from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":12,"Quantity":6,"Duration":12}' 'http://localhost:80/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: '"$u1_shop"'|{"Bidable":false,"Pictures":["https://picoolio.net/images/2018/11/13/basket2_result57b08a217c7b4c59.jpg"],"Name":"Green basket from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":12,"Quantity":6,"Duration":12}' 'http://localhost:80/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user7' --header 'X-request-password: cbpassword' --header 'params: '"$u1_shop"'|{"Bidable":false,"Pictures":["https://picoolio.net/images/2018/11/13/basket_result519c61c3f6839269.jpg"],"Name":"Red basket from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":12,"Quantity":6,"Duration":12}' 'http://localhost:80/ledger/ptwist/marketplace/shop_add_item'



#user 2 create some tiles

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: '"$u2_shop"'|{"Bidable":false,"Pictures":["https://picoolio.net/images/2018/11/13/tiles2_result57ae3ca3b8dd3228.jpg"],"Name":"Black tiles from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":3,"Quantity":56,"Duration":12}' 'http://localhost:80/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user8' --header 'X-request-password: cbpassword' --header 'params: '"$u2_shop"'|{"Bidable":false,"Pictures":["https://picoolio.net/images/2018/11/13/tiles_result0ab2eb5a5b163121.jpg"],"Name":"Colorfull tiles from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":5,"Quantity":67,"Duration":12}' 'http://localhost:80/ledger/ptwist/marketplace/shop_add_item'


