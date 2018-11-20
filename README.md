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

# Swagger API
This is the main entry point for all frontends apps, the API is written in Node.js, using swagger & the fabric sdk.

Use ```http://localhost:8080/docs``` to access the swagger UI.

In short you have to log in with a user account to interract with the blockchain, so there is a /register endpoint, you give it username and password (in headers) and it returns the public key of the created user. To authentify a user it is the same deal but with /auth, it returns the public key of the user, in the same way.
 
 
Here are some quick examples:
 
 
Registering a new user:

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-password: newuserpw' 'http://localhost:8080/users/newuser'
```
 
gives:
``` 
Response Body
{
  "pubkey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEIyuCeAgv1PwAA1TGVi9v5XWN0h9W1K6mMALWKFyAiKg/jccDeGZ6wMGTzeJgBPyrFwBdPHWp2GcIvHXWfXy2EA=="
}
Response Code
200
Response Headers
{
  "connection": "keep-alive",
  "content-type": "application/json",
  "date": "Mon, 22 Oct 2018 13:33:51 GMT",
  "transfer-encoding": "chunked"
}
```
 
 
 
Some failed authentication :

```
curl -X GET --header 'Accept: text/plain' --header 'X-request-password: invalidpw' 'http://localhost:8080/users/newuser'
```
 

```
Response Body
Unauthorized
Response Code
401
Response Headers
{
  "connection": "keep-alive",
  "content-type": "text/plain",
  "date": "Mon, 22 Oct 2018 13:34:51 GMT",
  "transfer-encoding": "chunked"
}
```
 
 
 
The /ledger endpoint is the ones allowing you to interract with the blockchain, it require username/password arguments (in header, still).
Then since it is a very generic API, you should specify the channel you want to use.
 
In short, a channel is like a database in the blockchain, like a namespace, the blockchain can have several. In our implementation there is only one channel, named "ptwist".
 
Let's say we want to transfer tokens, for now our request to the API will look like this :

```
http://lochalhost:8080/ledger/ptwist/[...]
+ login/pw in headers.
```
 
Then you have to specify the chaincode to use. The chaincode is like which software you want to run on the database, (from a data access point of view, it only have access to one table on the database). For now we have developed three chaincodes : ERC20 (the one handling the tokens), invoicing (the one handling invoices), and marketplace, the one handling the marketplace operations.
 
In the example where we want to transfer tokens, we now have this :
 
 ```
http://lochalhost:8080/ledger/ptwist/ERC20[...]
+ login/pw in headers.
```
 
Then you finally specify which function will be called in the said chaincode, the ERC20 chaincode contains several functions, which are listed at the end of this mail with examples, for our transaction we want to use the transfer function :


 
 
Note that this function will actually change the ledger state (some tokens will be transferred), so for the transaction to be recorded, you have to make an invoke, meaning the request will be POST, as opposed to GET, which will perform a query, meaning everything happening in the function call will not be committed in the ledger.
This case is useful for functions that does not modify the ledger state, like “balanceOf" or “latest", they only provide information, they do not write in the blockchain.
 
So, following our example, we now have :
 
```
POST request to :
http://lochalhost:8080/ledger/ptwist/ERC20/transfer/
+ login/pw in headers.
```
 
Then, thoses functions may require arguments, to specify them, you should use an additionnal parameter, called "params", in the header of your request.
It is given in the form of a string, first value being the first parameter, etc,  parameters are separated by pipes.
 
So, still building our example request, we now have :
 
```
POST request to :
http://lochalhost:8080/ledger/ptwist/ERC20/transfer/
+ login/pw in headers.
+ params in header, separated by pipes.
 
```

Lets say we want to transfer 10 tokens to bob, which have a public key "BOBPUBKEY", it would then give us this string :
"BOBPUBKEY|10"

 
Now assuming we are the central bank, the complete request we have to make looks like this :

```
POST request to :
http://lochalhost:8080/ledger/ptwist/ERC20/transfer/
In header params :
- X-request-username = centralbank
- X-request-password = cbpassword
- params = BOBPUBKEY|10
```
 
Here is how it looks like in the form of a curl request:

```
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' --header 'X-request-username: centralbank' --header 'X-request-password: cbpassword' --header 'params: BOBPUBKEY|10' 'http://localhost:8080/ledger/ptwist/ERC20/transfer'
```
 
If everything went fine, we have this response :
```
{
  "status": "200",
  "payload": "Successfull transaction",
  "message": ""
}
```

The "status" key in this json describe the success of the transaction in the blockchain, it is by no way linked to the HTTP code response.
In other words, the 200 http code response from the API does not necessarly tells you that the chaincode returned a successfull transaction.
For example, let's say that i dont have enough tokens to perform the transfer,  the API will return a 200 HTTP code, since it has delivered the transaction proposal to the blockchain sucessfully, but i will get this json response :
 
```
{
  "status": "500",
  "payload": "",
  "message": "Error: Failed to send Proposal, chaincode responded with :Transfer: permission denied, (insufficient funds ?)"
}
```
 
This is given with a 200 http response code, even tough the invoke failed.
Note that the status is 500,  if the returned status is not 200 you can assume something went wrong. 

 
##ERC20 chaincode functions:
 
- latest
 
This function returns the last 10 transactions involving the user given as parameter.
 
Paramaters:
1 - the public key of a user
 
Payload :
It returns a json array of this kind of object, each of them is a transaction involving the user (either from or to):
 
{
  "txid": "The transaction uuid",
  "timestamp": POSIX timestamp of the transaction,
  "value": 
{
    "From": "Public key sending the funds",
    "To": "Public key receiving the funds",
    "Value": Amount of tokens transfered
  }
}
 

- balanceOf
This function returns how much token a given user have.
Paramaters:
1 - the public key of a user
 
Payload :
It returns a plain text value of the token amount, like :
10089
 

- transfer
This function transfer the given amount of tokens to a given user.
The funds originate from the user logged in.
 
Paramaters :
1 - The public key of the user to which you want to tranfer tokens
2 - Amount of tokens to transfer
 
Payload :
It returns a plain text string saying if it worked, like :
Successfull transaction
 

- transferFrom
This function transfer the given amount of tokens to a given user.
The funds originate from the user given as parameter.
For the operation to be successfull, the specified user spending tokens must have allowed the user triggering the transaction to withdraw from his account a sufficient amount of funds. This action can be done by the "approve" function.
 
Paramaters:
1 - The public key of the user spending tokens
2 - The public key of the user receiving tokens
3 - Amount of tokens to transfer
 
 
Payload :
It returns a plain text string saying if it worked, like :
Successfull transaction
 
 
- approve
This function allow a given user to withdraw tokens from your account on your behalf, with a given limit.
 
Paramaters:
1 - The public key of the user you want to allow spending your tokens
2 - Amount of tokens you allow the given user to use on your behalf.
 
Payload :
It returns a plain text string saying if it worked, like :
Successfull approval
 
 
 
##Invoicing chaincode functions:
 
- createBill
Create a bill in the blockchain, the bill is owned by the one logged in.
He will be the one who receive the funds when the bill is eventually paid.
 
 
Paramaters:
1 - A son array of this format:
[
            {
                        "Name":"product_name",
                        "Amount": [product price (number)] ,
                        "Count": [product quantity (number)]
            },
            {"Name":"salad","Amount":3, “Count" : 1}
]
 
 
Payload:
It returns a plain text string of the bill id created , like :
4a42b55c1b2e8f277c3386faed6ba55e1972766c02c9e1cb0754b9998b5bb33d
 

- payBill
Attempt to pay the bill identified by his id passed as parameter.
This function calls the ERC20 chaincode and transfer the bill amount from the one signing the transaction to the one who created the bill. 
 
Paramaters:
1 - the id given by a “createBill" call, identifying the bill you want to pay.
 
Payload:
It returns a plain text string containing the recipient address, and the total amount paid , and the response from ERC20 chaincode (this needs to be formalized,  in the future it might return a proper json)
For now it returns this messy thing:
Invoke chaincode successful. ownerid : MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtq9gN/GrtZEGlq0KMZaRU1vsKxt++LUabVYj88n5u7X6/GIqz55dS4NHA2GAR2EqpQQ5kmsMxjS+PmzftTgq4Q==, totalamount: 5, Got response Successfull transaction
 


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






