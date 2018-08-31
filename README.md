# ERC20_fullstack
fullstack implementation of a business logic (retail), using erc20 tokens and invoicing chaincode on top of hyperledger fabric.

# Deployment:
Right after cloning the repo, run init.sh :

``` ./init.sh ```

This will check for dependancies, download fabric binaries and go libraries needed from the web.
This script needs to be run only one time, first time you want to use the stack.
Then launch the full.sh script:

``` ./launch.sh ```

This will generate local docker containers, containing node api and merchant web-app
Then launch the docker network and containers, enroll a "centralbank" user (default pass is cbpassword),
install both ERC20 and invoicing chaincodes on the peer, then create a file : **centralbank_pubkey.txt**,
which contain the central bank address in the ERC20 chaincode 

# Node API
This is the main entry point for all frontends apps, the API is written in Node.js, using fabric sdk.
To interract with the blockchain, you have to submit a POST request to one of these enpoints :

**/register** To register new users, returns their public key

**/auth** To verify credentials

**/query** To query the chaincode

**/invoke** To invoke the chaincode

At all these addresses, you at least have to provide the arguments username/password, they must be valid credentials, previously enroled via /register

For example, here is some example of registering a new user, and confirming he is enrolled :

``` curl --data "username=john" --data "password=johnpw" http://localhost:8080/register ```

gives you :
```
{"status" : "ok", "message": "User registered successfully", "pubkey" : "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFpswKd64LTnW3wDEMN93bYxznc4bb4Zlf6gkfDM61yEHxkAxnNmu2VLxKizVbvkL2a/vNVDlInHgaRCykmSQew=="}
```

``` curl --data "username=john" --data "password=johnpw" http://localhost:8080/auth ```

gives you :

```
{"status" : "ok", "payload" : "", "message" : "", "pubkey" : "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEFpswKd64LTnW3wDEMN93bYxznc4bb4Zlf6gkfDM61yEHxkAxnNmu2VLxKizVbvkL2a/vNVDlInHgaRCykmSQew==" }
```


## /register
Params in : 
- username
- password

Returns in JSON :
- status (ok/failed)
- message (error message if any, empty otherwise)
- pubkey (the public key of the registered user)

## /auth
Params in : 
- username
- password

Returns in JSON :
- status (ok/403)
- message (error message if any, empty otherwise)
- payload (not used)

in case of success authetification:

- pubkey (the public key of the user )


## /query
Params in : 
- username
- password
- channel (the fabric channel wanted for this query)
- chaincode (the name of the chaincode to be used)
- func (the function that will be called in the chaincode (first arg))
- args (the arguments of the function called, in the form of a JSON array)

Returns in JSON :
- status (ok/failed/403)
- message (error message if any, empty otherwise)
- response (the payload of the query)

Here is a query example, asking for the balance of some public key :

```
curl --data "channel=ptwist" --data "chaincode=ERC20" --data "func=balanceOf" --data-urlencode 'args=["MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEZjO2mFJBvtWyNhBoNlDRRtbPoryOJkyPaDkYyZiNa4wBXeGAS8jCEBmotWq6hWc/SWU2Tj9Og5nNj8GtgxnGSg=="]' --data 'username=alice' --data 'password=hello' http://localhost:8080/query
```

Note that the args are urlencoded, beacause they can contain special characters that could mess things up otherwise.

## /invoke
Params in : 
- username
- password
- channel (the fabric channel wanted for this query)
- chaincode (the name of the chaincode to be used)
- func (the function that will be called in the chaincode (first arg))
- args (the arguments of the function called, in the form of a JSON array)

Returns in JSON :
- status (200/403/500)
- message (error message if any, empty otherwise)
- response (the payload of the query)

Here is a invoke example, transfering some tokens to a public key :

```
curl --data "channel=ptwist" --data "chaincode=ERC20" --data "func=transfer" --data 'username=alice' --data 'password=hello' http://localhost:8080/invoke --data-urlencode 'args=["MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEH5PfR4goewV1uKHYMGVpVgJN4KiQhIn++n4cAoJhJdMlzsgjyXXVrqVF4lFS0q3ylVW/V1KAiwQ1thX7RqlyWA==","45"]'
```


/!\ There is currently no front-end methode to register new users, to register a new user you must use the API directly with curl, example above /!\

# Mobile App
The mobile app is a wallet, which also has a feature to pay an invoice specifically, via invoicing chaincode.
It uses react native, so to run it you should install it, see here : https://facebook.github.io/react-native/docs/getting-started.html
Then, from the root of the repo, go to the app folder and run it :

``` 
cd ./Pwallet
react-native run-android

```
Assuming you run it on android device (either hardware and plugged in with usb debugging actived or emulated).

/!\ For now you need to manually update the address of the api server on the source code /!\

I know it is dirty and we need to implement a broadcast system of the available APIs (one per org)

The app is quite buggy in error cases, a lot of problems can happens that are unhandled (like network failure, unexpected characters in json parse in some specific cases, etc..) If it crashes and display a big red screen with technical crap, dont worry, type "RR" to reload.

Also a good tip is to use a physical mirror to reflect your screen into the webcam to scan QRcodes, in case you use an emulator and a screen-attached webcam.


# Merchant App
This is a web-based app written in php/js, it allows you to create an invoice in the invoicing chaincode.

If everything is working correctly, just go to the web address and it will ask for login :

``` http://localhost/index.php ```
Note that every login/pw will work, no verification is done on the login process.

If you enter bad credentials, you wont be able to invoke the blockchain is all, but you can access the app.

There you can edit your invoice, do not forget to open the customer interface (there is a button) before pressing create invoice, since you can't open it anymore in the process page.






