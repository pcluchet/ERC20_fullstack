#! /bin/bash

#create 6 users
u1="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/user1' | jq -r '.pubkey')"

u2="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/user2' | jq -r '.pubkey')"

u3="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/user3' | jq -r '.pubkey')"

u4="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/user4' | jq -r '.pubkey')"

u5="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/user5' | jq -r '.pubkey')"

u6="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: cbpassword' 'http://localhost:8080/users/user6' | jq -r '.pubkey')"


#each user create a shop

u1_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user1' --header 'X-request-password: cbpassword' --header 'params: myshopp' 'http://localhost:8080/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

echo "$u1_shop"

u2_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user2' --header 'X-request-password: cbpassword' --header 'params: myshopp' 'http://localhost:8080/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u3_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user3' --header 'X-request-password: cbpassword' --header 'params: myshopp' 'http://localhost:8080/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u4_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user4' --header 'X-request-password: cbpassword' --header 'params: myshopp' 'http://localhost:8080/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u5_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user5' --header 'X-request-password: cbpassword' --header 'params: myshopp' 'http://localhost:8080/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"

u6_shop="$(curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user6' --header 'X-request-password: cbpassword' --header 'params: myshopp' 'http://localhost:8080/ledger/ptwist/marketplace/new_shop' | jq -r '.payload')"


#user 1 create some baskets

curl -v -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user1' --header 'X-request-password: cbpassword' --header 'params: '"$u1_shop"'|{"Bidable":false,"Picture":"https://picoolio.net/images/2018/11/13/basket3_result301871c2667cd6f8.jpg","Name":"Blue basket from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":12,"Quantity":6,"Duration":12}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user1' --header 'X-request-password: cbpassword' --header 'params: '"$u1_shop"'|{"Bidable":false,"Picture":"https://picoolio.net/images/2018/11/13/basket2_result57b08a217c7b4c59.jpg","Name":"Green basket from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":12,"Quantity":6,"Duration":12}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user1' --header 'X-request-password: cbpassword' --header 'params: '"$u1_shop"'|{"Bidable":false,"Picture":"https://picoolio.net/images/2018/11/13/basket_result519c61c3f6839269.jpg","Name":"Red basket from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":12,"Quantity":6,"Duration":12}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'



#user 2 create some tiles

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user2' --header 'X-request-password: cbpassword' --header 'params: '"$u2_shop"'|{"Bidable":false,"Picture":"https://picoolio.net/images/2018/11/13/tiles2_result57ae3ca3b8dd3228.jpg","Name":"Black tiles from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":3,"Quantity":56,"Duration":12}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user2' --header 'X-request-password: cbpassword' --header 'params: '"$u2_shop"'|{"Bidable":false,"Picture":"https://picoolio.net/images/2018/11/13/tiles_result0ab2eb5a5b163121.jpg","Name":"Colorfull tiles from recycled HDPE","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":5,"Quantity":67,"Duration":12}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'


#user 3 create some 3d printed toys

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user3' --header 'X-request-password: cbpassword' --header 'params: '"$u3_shop"'|{"Bidable":true,"Picture":"https://picoolio.net/images/2018/11/13/chess-7_resultc2f35019da7d180a.jpg","Name":"3d printed chess set","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":10,"Quantity":1,"Duration":72}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user3' --header 'X-request-password: cbpassword' --header 'params: '"$u3_shop"'|{"Bidable":true,"Picture":"https://picoolio.net/images/2018/11/13/construction_result790e2198bef7b4d1.jpg","Name":"3d printed toy construction set","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":14,"Quantity":1,"Duration":72}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'


curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user3' --header 'X-request-password: cbpassword' --header 'params: '"$u3_shop"'|{"Bidable":true,"Picture":"https://picoolio.net/images/2018/11/13/car_toy_result26a841af550fae2b.jpg","Name":"3d printed car toy","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":23,"Quantity":1,"Duration":96}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: user3' --header 'X-request-password: cbpassword' --header 'params: '"$u3_shop"'|{"Bidable":false,"Picture":"https://picoolio.net/images/2018/11/13/whistle_red_result3687724e7f309f22.jpg","Name":"3d printed whistle","Detail":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sed venenatis est, eu fringilla odio. In et ex lorem. Quisque vitae tincidunt orci. Maecenas molestie massa ac lacinia sodales. Aenean feugiat justo in orci eleifend, sit amet ullamcorper augue vulputate. Proin sit amet interdum mauris. Duis luctus auctor aliquam. Phasellus mollis nisi a augue porta euismod. Phasellus ultricies diam non magna aliquam porttitor. Cras sit amet sagittis turpis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean sit amet sodales diam. Sed ut enim quis leo malesuada pretium.","Price":3,"Quantity":1,"Duration":72}' 'http://localhost:8080/ledger/ptwist/marketplace/shop_add_item'



