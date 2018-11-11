import React, { Component } from 'react';
import { Text, TextInput, Icon , TouchableOpacity, ScrollView, View, StyleSheet,
  ActivityIndicator, AsyncStorage, Picker, FlatList, Image
} from 'react-native';
//import { Constants } from 'expo';
import Swiper from 'react-native-swiper';
import TimerMixin from 'react-timer-mixin';
import QRCode from 'react-native-qrcode';
import Camera from 'react-native-camera';
import Dimensions from 'Dimensions';
//import BarcodeScanner from 'react-native-barcodescanner';


const APIURL = "http://10.0.2.2:8080";
//const APIURL = "http://localhost:8080";
const CHANNEL = "ptwist";
const CHAINCODE = "ERC20";
const INVOICINGCHAINCODE = "invoicing";

export const getUserBalance = (username, password, pubkey) => {
  
    var argarray = [];
    argarray.push(encodeURI(pubkey));
    return fetch(`${APIURL}/ledger/${CHANNEL}/${CHAINCODE}/balanceOf`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-request-username': username,
          'X-request-password': password,
          'params': pubkey 
        },
        /*
        body: JSON.stringify({
          func: "balanceOf",

          args : JSON.stringify(argarray),
          username: username,
          password: password,
          channel: CHANNEL,
          chaincode : CHAINCODE,
        }),
        */
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {

            console.log("ERROR HAPPENED :" + error);
        });
}

export const getLatestTransfers = (username, password, pubkey) => {
  
    //var argarray = [];
    //argarray.push(encodeURI(pubkey));
    return fetch(`${APIURL}/ledger/${CHANNEL}/${CHAINCODE}/latest`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-request-username': username,
          'X-request-password': password,
          'params': pubkey 
        },
        /*
        body: JSON.stringify({
          func: "latest",
          args : JSON.stringify(argarray),
          username: username,
          password: password,
          channel: CHANNEL,
          chaincode : CHAINCODE,
        }),
        */
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {

            console.log("ERROR HAPPENED :" + error);
            console.log(error);
        });
}



export const AuthLogin = (username, pwd) => {
    return fetch(`${APIURL}/users/${username}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-request-password': pwd
        },
        /*
        body: JSON.stringify({
          username: username,
          password: pwd,
        }),
        */
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log("ERR ICI :" + error);
        });
}


export const getAllowancesFrom = (username) => {
    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: "whoOwesMe",
          Id: username,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log("ERR LA :" + error);
        });
}

export const getAllowancesTo = (username) => {
    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: "whoOweI",
          Id: username,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });
}

export const TransferTokens = (username, password, to, amount) => {
  var argarray = [];
  argarray[0] = to;
  argarray[1] = amount;
    return fetch(`${APIURL}/ledger/${CHANNEL}/${CHAINCODE}/transfer`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-request-username': username,
          'X-request-password': password,
          'params': argarray[0] + '|' + argarray[1] 
        },

      /*
      body: JSON.stringify({
        func: "transfer",
        args : JSON.stringify(argarray),
        username: username,
        password: password,
        channel: CHANNEL,
        chaincode : CHAINCODE,
      }),
      */
      })
      .then((response) => {
          return response;
      })
      .catch((error) => {
          console.log(error);
      });
      /*
    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: 'transfer',
          Id: username,
          To: to,
          Tokens: amount,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });
        */

}

export const PayBill = (username, password, billid) => {
  //var argarray = [];
  //argarray[0] = billid;
    return fetch(`${APIURL}/ledger/${CHANNEL}/${INVOICINGCHAINCODE}/payBill`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-request-username': username,
          'X-request-password': password,
          'params': billid 
        },
     })
      .then((response) => {
          return response;
      })
      .catch((error) => {
          console.log(error);
      });
      /*
    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: 'transfer',
          Id: username,
          To: to,
          Tokens: amount,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });
        */

}


export const createBill = (username, password, billitmlist) => {
  //var argarray = [];
  //argarray[0] = billid;
    return fetch(`${APIURL}/ledger/${CHANNEL}/${INVOICINGCHAINCODE}/createBill`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-request-username': username,
          'X-request-password': password,
          'params': billitmlist 
        },
     })
      .then((response) => {
          return response;
      })
      .catch((error) => {
          console.log(error);
      });
     }



export const ApproveTokens = (username, spender, tokens) => {

    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: 'approve',
          Id: username,
          Spender: spender,
          Tokens: tokens,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });

}

export const TransferTokensFrom = (username, to, amount, from) => {

    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: 'transferFrom',
          Id: username,
          To: to,
          From: from,
          Tokens: amount,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.log(error);
        });

}

export default class App extends Component {
  constructor(props) {
    super(props)
      
    this.interval = setInterval(() => {
      if (this.state.logged)
      {
      this.ft_getbalance();
      //this.ft_getAllowancesFrom();
      this.ft_getlatest();
      }
    }, 6500);




    this.state = {
      data:[],
      ongoinginvoice : [],
      ongoingbillid : "none",
      ongoingbilltotal : 0,
      invoiceEdit : true,
      qrcode: '',
      password : '',
      pubkey : "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEteL3xbiv2NCEn8G7uyzYtOb6ozyeSCKsUPL6MlDs3fnyyUpqzzzudhz7hJLnTLvt35o2OSLhT+k7Y5AcYzG/3g==",
      logged : false,
      name: '',
      username: 'centralbank',
      contactlist: '',
      balance: '0',
      transferamount: '', // nom de la bière
      transferfrom: '', // nom de la bière
      transferto: '', // nom de la bière
      description: '', // sa description
      spenderApprove: '',
      tokensApprove: '',
      transferPending : false,
      allowancesFrom: '',
      allowancesTo: '',
      currentbill : '',
      billtotal : '',
      billaddress : '',
      scanningContact: false,
      scanningBill: false,
      BalanceIsLoading: false, // la requête API est-elle en cours ?
      UserListIsLoading: false, // la requête API est-elle en cours ?
      contactlist : '[{"username" : "john", "pubkey" : "abc" }]',
    }
    this.RefreshContactList();
  }

  notAlreadyIn = (newuser,unparsedlist) => {
var list = JSON.parse(unparsedlist);
if (!list)
    return true;
var arrayLength = list.length;
for (var i = 0; i < arrayLength; i++) {
    if (list[i].username == newuser.username)
      return false;
    //Do something
}
return true;

  }

  addContactFromQR = (data) => {

    var scandata = JSON.parse(data);

    var raw = this.state.contactlist;
    console.log("contactlist = " + raw);
    try 
    {
    var obj = JSON.parse(raw);
    }
    catch (e)
    {
      console.log("shit happens");
    }
    var newusr = {
      username : scandata.u,
      pubkey : scandata.a,
    }
    if (!obj)
     obj = new Array();
    if (this.notAlreadyIn(newusr,this.state.contactlist))
    {
      obj.push(newusr);
      alert(" User added successfully ");
    }
    else
    {
      alert(" User not added : already in list ❌ ");
    }
    
    console.log("newlist = " + JSON.stringify(obj));
    this._storeData("@Pwallet:contacts_"+this.state.username, JSON.stringify(obj));
    this.state.scanningContact = false;
    this.RefreshContactList();
  }

  setBillFromQR = (data) => {

    var scandata = JSON.parse(data);
    this.state.billtotal = scandata.t;
    this.state.billaddress = scandata.id;
    this.state.scanningBill = false;

  }
  
  onBarCodeRead = (e) => {
    console.log("READ QRCODE = "+e.data);
    this.setState({qrcode: e.data});
    this.addContactFromQR(e.data);

  }

  onBillBarCodeRead = (e) => {
    console.log("READ QRCODE = "+e.data);
    this.setState({qrcode: e.data});
    this.setBillFromQR(e.data);

  }

  //local data storage

  _storeData = async(key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("ERROR SAVING PERSISTENT DATA");
      // Error saving data
    }
  }

  _retrieveData =  async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // We have data!!
        console.log("DATA = " + value);
        return value;
      }
     } catch (error) {
       console.log("error retreiving persistent data");
       return null;
       // Error retrieving data
     }
  }
  
  
////////////////////////////////////////////////////////////////////////////////
//  Transfer
////////////////////////////////////////////////////////////////////////////////

  transferbtn = (str) => {
    if (this.state.transferPending) {
      return (<ActivityIndicator size="large" color="#0000ff" style={{textAlign: 'center', fontWeight: '100', marginTop: '5%'}}/>)
    }
    else {
      return (
        <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
          {str}
        </Text>
      )
    }
  }

  loadContacts() {
    console.log("CONTACTLIST = " + this.state.contactlist);
    var clist = JSON.parse(this.state.contactlist) ;
    if (clist)
    {
      console.log("IN THE IFFFFF");
    return clist.map(user => (
       <Picker.Item label={user.username} value={user.pubkey} key={user.username}/>
    ))
  }
  else
  {
    return null;
  }
  }
  
  gencontactpicker = () =>{
    var k = this.loadContacts();
    if (k)
    {
      return (
      
         <Picker
        selectedValue={this.state.selectedUserType}
      onValueChange={(itemValue, itemIndex) => 
          {
            this.setState({selectedUserType: itemValue});
            this.setState({transferto: itemValue});
          }
          }>
    <Picker.Item label='Please select a contact...' value='0' />  
    {k} 
    </Picker>
);

    }
    else
    {

   return (
         <Picker
        selectedValue={this.state.selectedUserType}
      onValueChange={(itemValue, itemIndex) => 
          {
            this.setState({selectedUserType: itemValue});
            this.setState({transferto: itemValue});
          }
          }>
    <Picker.Item label='Please select a contact...' value='0' />  
    </Picker>
    );
    }
  }
  
  transfer = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>Transfer</Text>
        <View style={{ position: 'absolute', top: 10, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        </View>

        <View style={[{flex: 3}, styles.elementsContainer]}>
        {/*
        <View style={{flex: 1, backgroundColor: '#d9d9d9'}}>
          <TextInput style={{height: '50%', marginTop: '10%', textAlign: 'center', fontSize: 42, fontWeight: '200'}}
            placeholder="From"
            onChangeText={(transferfrom) => this.setState({ transferfrom })}
            value={this.state.transferfrom}>
          </TextInput>
        </View>
        */}
        <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
     {this.gencontactpicker()}     
    {/*
          <TextInput style={styles.textInput}
            placeholder="To"
            onChangeText={(transferto) => this.setState({ transferto })}
            value={this.state.transferto}>
          </TextInput>
    */}
        </View>
        <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
          <TextInput style={styles.textInput}
            placeholder="Amount"
            onChangeText={(transferamount) => this.setState({ transferamount })}
            value={this.state.transferamount}>
          </TextInput>
        </View>
      </View>

      <View style={styles.button}>
      <View style={{flex: 1, backgroundColor: '#4CB676'}}>
          <TouchableOpacity
          disabled={this.state.transferPending}
          onPress={this.ft_transfer}
          >
           {
              this.transferbtn("Send")
           }

          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }

////////////////////////////////////////////////////////////////////////////////
//  Allowances
////////////////////////////////////////////////////////////////////////////////
  
    ft_getAllowancesFrom = () => {
      if (this.state.username !== "") {
        getAllowancesFrom(this.state.username)
        .then((json) => this.setState({allowancesFrom: this.ft_balanceOfSafe(json)}))
        .catch(error => console.log(error))
      }
    }
    
    ft_getAllowancesTo = () => {
      if (this.state.username !== "") {
        getAllowancesTo(this.state.username)
        .then((json) => this.setState({allowancesTo: this.ft_balanceOfSafe(json)}))
        .catch(error => console.log(error))
      }
    }
    
    getText = (type, str) => {
      var argv = str.split("\"")
      var ret = []
      var len = argv.length
      
      if (len !== 1) {
        for (var index = 1; index < len; index += 4) {
          ret = ret.concat([`${type}: `, argv[index], "   ", "Tokens: ", argv[index + 2], "\n"])
        }
        return ret
      }
      
      return null
    }

  balance = () => {
    var allowancesFrom = this.getText("From", this.state.allowancesFrom)
    var allowancesTo = this.getText("To", this.state.allowancesTo)

    return (
      <View style={[{flex : 0.5}, styles.container]}>
        <Text style={styles.headerSty}>Balance</Text>
        <View style={{ position: 'absolute', top: 10, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        </View>


        <View style={[{flex: 1}, styles.elementsContainer]}>
        <View style={{flex: 0.2, backgroundColor: '#FFFFFF'}}>
          <Text style={styles.balancevalue}> {this.state.balance} </Text>
        </View>

        {/*
        <View style={{flex: 1, backgroundColor: '#d9d9d9'}}>
          <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            Allowances From
          </Text>
        */}
          <ScrollView  style={[{flex : 6}, styles.scrollview, {backgroundColor: '#FFFFFF'}]}>
            <Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
            {this.state.latesttransfers}
            </Text>
          </ScrollView>
        {/*
        </View>
        <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
          <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            Allowances To
          </Text>
          <ScrollView  style={styles.scrollview}>
            <Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
              {allowancesTo}
            </Text>
          </ScrollView>
        </View>
        */}
      </View>


      </View>
    );
  }

  allowance = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>Allowance</Text>

        <View style={[{flex: 3}, styles.elementsContainer]}>
        <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
          <TextInput style={styles.textInput}
            placeholder="Spender"
            onChangeText={(spenderApprove) => this.setState({ spenderApprove })}
            value={this.state.spenderApprove}>
          </TextInput>
        </View>
        <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
          <TextInput style={styles.textInput}
            placeholder="Tokens"
            onChangeText={(tokensApprove) => this.setState({ tokensApprove })}
            value={this.state.tokensApprove}>
          </TextInput>
        </View>
      </View>

      <View style={styles.button}>
      <View style={{flex: 1, backgroundColor: '#ffc2b3'}}>
        <TouchableOpacity
          disabled={this.state.transferPending}
          onPress={this.ft_approve}
          >
           {
              this.transferbtn("Approve")
           }

          </TouchableOpacity>
        </View>
      </View>
      </View>
    );
  }

  ft_balanceOfSafe = (json) => {
    console.log("BALANCE RECEIVED = "+ JSON.stringify(json))
    var jsonresp = JSON.parse(json._bodyText);
        if (json.status == 200 && jsonresp.response != "") {
            return jsonresp.response;
        }
        else
            return "0"
    }

  ft_getbalance = () => {
    if (this.state.username !== "") {
        getUserBalance(this.state.username, this.state.password, this.state.pubkey).then(
          json => this.setState({
            balance: this.ft_balanceOfSafe(json),
        }))
            .catch(error => console.log(error))
      }
  }

  getsymbol = (currtx) => {
      if (currtx.value.From == this.state.pubkey)
        return "↖ Debit"
      else
        return "↘ Credit"
  }

  getfromorto = (currtx) => {
      if (currtx.value.From == this.state.pubkey)
        return "To : " + this.trimAddr(currtx.value.To)
      else
        return "From : " + this.trimAddr(currtx.value.From)
  }


   timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }

ft_getlatest = () => {
    if (this.state.username !== "") {
        getLatestTransfers(this.state.username, this.state.password, this.state.pubkey).then(
          json => {
if (json.status == 200)
{
            let textlatest = ""
            let obj = JSON.parse(json._bodyText)
            obj = obj.response;

          var arrayLength = obj.length;
          for (var i = arrayLength - 1 ; i >= 0; i--) {
            //alert(myStringArray[i]);
            //textlatest += "Transaction id : " + this.trimAddr(obj[i].txid) + "\n"
            textlatest += this.getsymbol(obj[i]) + "  \n" + this.timeConverter(obj[i].timestamp) + "\n"
            textlatest += this.getfromorto(obj[i]) + "\n"
            textlatest += "Amount : " + obj[i].value.Value + "\n"
            textlatest += "\n\n"
          }
            this.setState({
            latesttransfers: textlatest,
        })
      }
      }
      )
            .catch(error => console.log(error))
      }
  }

  login = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>Pcoin Wallet</Text>


        <View style={[{flex: 3}, styles.elementsContainer]}>
        <View style={{flex: 1, backgroundColor: '#d9d9d9'}}>
          <TextInput style={{height: '50%', marginTop: '10%', textAlign: 'center', fontSize: 42, fontWeight: '200'}}
            placeholder="Username"
            onChangeText={(username) => this.setState({ username })}>
          </TextInput>
        </View>
        <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
          <TextInput style={styles.textInput}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(password) => this.setState({ password })}>
          </TextInput>
        </View>
      </View>

      <View style={styles.button}>
      <View style={{flex: 1, backgroundColor: '#4CB676'}}>
          <TouchableOpacity onPress={this.Login }>
            <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              Login
            </Text>
          </TouchableOpacity>

        </View>
      </View>
      </View>
    );
}


  qrdata = () => {

    var ret = '';
    ret += '{"u" :"';
    ret += this.state.username;
    ret += '", "a" : "';
    ret += this.state.pubkey;
    ret += '"}';
    return ret;
  }
  qrcode = () => {
    console.log("PUBKEY = " + this.state.pubkey);
    console.log("QRDATA = " + this.qrdata());
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>My address :</Text>


      <View style={styles.qrcodecontainer}>
      <QRCode style={styles.qrcode}
          value={this.qrdata()}
          size={250}
          bgColor='black'
          fgColor='white'/>
      </View>
      </View>
    );
}


RefreshContactList =  () => {



  //this._storeData("@Pwallet:contacts",'[{"username" : "john", "pubkey" : "abc" },{"username" : "joe", "pubkey" : "def" } ]');
  var reee;
      reee = AsyncStorage.getItem("@Pwallet:contacts_"+this.state.username).then(
        (localdata) => {
  this.setState({"contactlist": localdata});


        }
      );
  }

  trimAddr = (pubkey) => {
    var ret = '';
    ret += pubkey.substring(0,5);
    ret += "[...]"
    ret += pubkey.substring(pubkey.length - 10,pubkey.length);
    return ret;
  }

  ParseContactList = (localdata) => {

    var ret = "";
  try {
  var localcontacts = JSON.parse(localdata);
  }
  catch (e)
  {
    return ret;
  }
  if (!localcontacts)
  return "";
  //if (!localcontacts)
  //return "";



  var arrayLength = localcontacts.length;
  for (var i = 0; i < arrayLength; i++) {
    console.log(JSON.stringify(localcontacts[i]));
    //  alert(myStringArray[i]);
    //Do something
    ret += 'Username : ' + localcontacts[i].username;

    ret = ret.concat("\n");
    ret += 'Adress : ' + this.trimAddr(localcontacts[i].pubkey);
    ret = ret.concat("\n\n");
    //ret += '/n';
  }
  return ret;

  }

  /*
  return (
    <ScrollView  style={styles.scrollview}>
<Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
this guy
</Text>

<Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
other guy
</Text>
</ScrollView>
);
*/

  contacts = () => {
  //this.myContacts();
  
  var myContacts = this.ParseContactList(this.state.contactlist);
  //myContacts = "";
  console.log("mycontactsXYTCUYGVKUBHILJHLVYCFTXDHJKNBVCJFGHXDCGVJKLNMJBVHCGXDFWSXHCVK" +  myContacts);
    return (
      <View style={styles.container}>

      <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            My Saved addresses :
          </Text>
          <ScrollView  style={styles.scrollview}>
          <Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
            {myContacts}
          </Text>
          </ScrollView>
          <View style={{flex: 0.3, backgroundColor: '#4CB676'}}>
            <TouchableOpacity onPress={() => this.setState({ scanningContact : true })}>
            <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              Add an address
            </Text>
          </TouchableOpacity>
          </View>
      </View>

    );
}

  paybill = () => {
    return (
      <View style={styles.container}>
      <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            Pay a bill :
          </Text>
          <Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
          Bill total : {this.state.billtotal}{"\n"} 
          Bill address : {this.state.billaddress} 
          </Text>
          <View style={{flex: 0.3, backgroundColor: '#4CB676'}}>
            <TouchableOpacity onPress={this.ft_paybill}>
            <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              Pay this bill
            </Text>
          </TouchableOpacity>

          </View>
      <View style={{flex: 0.3, backgroundColor: '#4CB676'}}>
            <TouchableOpacity onPress={() => this.setState({ scanningBill : true })}>
            <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              scan a bill
            </Text>
          </TouchableOpacity>

          </View>

      </View>

    );
}

_addQty = (index) => {
  var data = this.state.data;
  data[index].qty = data[index].qty + 1;
  this.setState({data : data});
}

_rmQty = (index) => {
  var data = this.state.data;
  data[index].qty -= 1;
  if (data[index].qty == 0)
  {
    data[index].qty = 1;
  }
  this.setState({data : data});
}

_rmItm = (index) => {
  var data = this.state.data;
  data.splice(index,1);
  this.setState({data : data});
}

_addItm = () => {
  var data = this.state.data;
  var price = this.state.itm_price;
  var name = this.state.itm_to_add;

  var toadd = {id: name, productName: name, qty:1, price: price }; 
  data.push(toadd);
  
  this.setState({data : data});
}

_createInvoice = () => {
  var data = this.state.data;

  var pararray = [];

  for (var i = 0; i < this.state.data.length; i++) 
  {
    var itm = {"Name" : "i", "Amount" : 0, "Count" : 0};
    itm.Name = this.state.data[i].productName;
    itm.Amount = Number(this.state.data[i].price);
    itm.Count = this.state.data[i].qty;
    pararray.push(itm);
  };
  console.log("ITEMLIST SENT TO CC :" + JSON.stringify(pararray));
  var itmlist = JSON.stringify(pararray);


  createBill(this.state.username, this.state.password, itmlist) .then(json => {


            console.log("DEBUG: jsont CREAT BILL :" + JSON.stringify(json));
            //console.log("DEBUG: jsontransferst :" + json.result);
            var respjson = JSON.parse(json._bodyText);
            if (json.status == 200 && respjson.status == "200")
            {
              this.setState({ongoingbillid : respjson.payload});
              this.setState({ongoingbilltotal : this._getTotalPrice()});
              this.setState({invoiceEdit : false});
              this.setState({invoiceEdit : false});
              this.setState({ongoinginvoice : this.state.data});
              this.setState({data : []});

              alert("Bill creation successfull ! ✅");
            }
            else
            {
              alert("Bill creation failed! ❌");
            }
    }
  );
}

_invoiceDisplay = () => {
  this.setState({invoiceEdit : false});
}

_invoiceEdit = () => {

  this.setState({invoiceEdit : true});
}


_getTotalPrice = () => {
  var total = 0;
  for (var i = 0; i < this.state.data.length; i++) {
      total += this.state.data[i].qty * this.state.data[i].price;
  };
  return total;
}

_displayGetTotalPrice = () => {
  var total = 0;
  for (var i = 0; i < this.state.ongoinginvoice.length; i++) {
      total += this.state.ongoinginvoice[i].qty * this.state.ongoinginvoice[i].price;
  };
  return total;
}

_renderItem = ({item, index}) => {
  var margin = 10;
  var subViewWidth = Dimensions.get('window').width-(margin*9);
  return  <View key={index} style={{ marginBottom: margin, marginTop: index==0?margin:0}}>
              <View style={{flexDirection: 'row', flex:1}}>
                  <View style={{justifyContent: 'space-between', width:subViewWidth+10, borderBottomWidth : 1, borderBottomColor : "#ccc"}}>
                      <View>
                          <TouchableOpacity style={{position: 'absolute', right: 0}}
                            onPress={ ()=> {
                                      this._rmItm(index);
                              }}>
                              <View>
                                <Text
                                style={{ fontWeight : "bold", borderRadius:500, borderWidth : 1, borderColor : "#f1948a", color: "#f1948a"}}
                                >
                                     &nbsp; X </Text>
                              </View>
                          </TouchableOpacity>

                          <Text style={[styles.txtProductName, {width:subViewWidth, fontWeight : "bold"}]}>{item.productName}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop:5}}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <TouchableOpacity
                                  onPress={ ()=> {
                                      this._rmQty(index);
                              }}>

                                  <View>
                                <Text
                                
                                style={{ fontWeight : "bold", borderRadius:500, borderWidth : 1, borderColor : "#ccc"}}
                                >&nbsp;&nbsp;-&nbsp;&nbsp;</Text>
                                    </View>
                              </TouchableOpacity>
                              <Text style={{marginHorizontal: 5, fontSize: 18}}>{item.qty}</Text>

                              <TouchableOpacity
                                  onPress={ ()=> {
                                      this._addQty(index);
                                  }}>
                                 <View>
                                <Text
                                style={{ fontWeight : "bold", borderRadius:500, borderWidth : 1, borderColor : "#ccc"}}
                                >&nbsp;&nbsp;+&nbsp;&nbsp;</Text>
                                    </View>
                              </TouchableOpacity>

                          </View>
                          <Text style={{marginHorizontal: 5, fontSize: 18}}>{item.price}</Text>
                      </View>
                  </View>
              </View>
          </View>
}

_displayRenderItem = ({item, index}) => {
  var margin = 10;
  var subViewWidth = Dimensions.get('window').width-(margin*9);
  return  <View key={index} style={{ marginBottom: margin, marginTop: index==0?margin:0}}>
              <View style={{flexDirection: 'row', flex:1}}>
                  <View style={{justifyContent: 'space-between', width:subViewWidth+10, borderBottomWidth : 1, borderBottomColor : "#ccc"}}>
                      <View>
                                               <Text style={[styles.txtProductName, {width:subViewWidth, fontWeight : "bold"}]}>{item.productName}</Text>
                      </View>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop:5}}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                       <Text style={{marginHorizontal: 5, fontSize: 18}}>Qtt : {item.qty}</Text>

                                                   </View>
                          <Text style={{marginHorizontal: 5, fontSize: 18}}>{item.price}</Text>
                      </View>
                  </View>
              </View>
          </View>
}


EditIface = () => {
    var margin = 10;
  var subViewWiddth = Dimensions.get('window').width-(margin*9);
    var subViewWidth = Dimensions.get('window').width;




  return ( <View style={[styles.container, {alignItems : "center" }]}>
       <FlatList
                renderItem={this._renderItem}
                keyExtractor={ (item,index) => index.toString() }
                data={this.state.data} 
                extraData={this.state}
       />
            <View style={{flexDirection:'row', justifyContent: 'space-between', margin : 10, width : subViewWiddth, marginBottom: 10}}>
                <Text style={{flex:3, fontSize: 18}}>Total amount</Text>
                <Text style={{flex:1, fontSize: 24, textAlign:'right', fontWeight : "bold"}}>{this._getTotalPrice()}</Text>
            </View>

            <View style={{flexDirection:'row', justifyContent: 'space-between', borderTopWidth : 1, borderTopColor : "#ccc", paddingTop : 10}}>
                <TextInput style={{borderWidth : 1, borderRadius: 3, borderColor : "#ccc", width : (0.6 * subViewWidth), marginLeft : 10}}
                placeholder="Item name"
                onChangeText={(itm_to_add) => this.setState({ itm_to_add })}>
                </TextInput>
               <TextInput style={{borderWidth : 1, borderRadius: 3, borderColor : "#ccc", width : (0.2 * subViewWidth), marginLeft : 10}}
                placeholder="Price"
                onChangeText={(itm_price) => this.setState({ itm_price })}>
                </TextInput>

                              <TouchableOpacity
                                  onPress={ ()=> {
                                      this._addItm();
                                  }}>
                                 <View>
                                <Text
                                style={{ borderRadius:3, borderWidth : 1, borderColor : "#ccc", margin : 10}}
                                >&nbsp;&nbsp;Add&nbsp;&nbsp;</Text>
                                    </View>
                              </TouchableOpacity>
</View>
            <View style={{flexDirection:'row', justifyContent: 'center'}}>
               <TouchableOpacity
                                  onPress={ ()=> {
                                      this._createInvoice();
                                  }}>
                                 <View>
                                <Text
                                style={{ fontWeight : "bold", borderRadius:3, borderWidth : 1, borderColor : "#ccc", margin : 10, fontSize : 37}}
                                >&nbsp;&nbsp;Create Invoice&nbsp;&nbsp;</Text>
                                    </View>
                </TouchableOpacity>



            </View>

</View>
);
}

  qrdata_bill = () => {

    var ret = '';
    ret += '{"id" :"';
    ret += this.state.ongoingbillid;
    ret += '", "t" : "';
    ret += this.state.ongoingbilltotal;
    ret += '"}';
    return ret;
  }

DisplayIface = () => {
    var margin = 10;
  var subViewWiddth = Dimensions.get('window').width-(margin*9);
    var subViewWidth = Dimensions.get('window').width;


  return ( <View style={[styles.container, {alignItems : "center" }]}>
       <FlatList
                renderItem={this._displayRenderItem}
                keyExtractor={ (item,index) => index.toString() }
                data={this.state.ongoinginvoice} 
                extraData={this.state}
       />
            <View style={{flexDirection:'row', justifyContent: 'space-between', margin : 10, width : subViewWiddth, marginBottom: 10}}>
                <Text style={{flex:3, fontSize: 18}}>Total amount</Text>
                <Text style={{flex:1, fontSize: 24, textAlign:'right', fontWeight : "bold"}}>{this._displayGetTotalPrice()}</Text>
            </View>
            
        <QRCode style={[styles.qrcode, {padding : 20}]}
          value={this.qrdata_bill()}
          size={250}
          bgColor='black'
          fgColor='white'/>

        <Text style={{flex:3, fontSize: 18}}>&nbsp;</Text>


        </View>
);
}





  createbill = () => {
    var margin = 10;
  var subViewWiddth = Dimensions.get('window').width-(margin*9);
    var subViewWidth = Dimensions.get('window').width;

    var stylePassive = { borderTopRightRadius:6, borderTopLeftRadius : 6, 
      borderTopWidth : 1,
      borderRightWidth : 1,
      borderLeftWidth : 1,
       borderColor : "#ccc", fontSize : 20,
      borderBottomWidth : 1,
      padding : 6,
      backgroundColor : "#eee"};

    var styleActive = 
    {  borderTopRightRadius:6, borderTopLeftRadius : 6, 
                                borderTopWidth : 1,
                                borderRightWidth : 1,
                                borderLeftWidth : 1,
                                 borderColor : "#ccc", padding : 6, fontSize : 20, borderBottomColor : "#fff"};
 

    var styleEdit = stylePassive;
    var styleDisplay = styleActive;
    var iface = this.DisplayIface();

    if (this.state.invoiceEdit)
    {
    var styleEdit = styleActive;
    var styleDisplay = stylePassive;
    var iface = this.EditIface();
    }

    return (
      <View style={[styles.container, {alignItems : "center" }]}>
     <View style={{flexDirection:'row', justifyContent: 'flex-start', width : subViewWidth}}>
          <TouchableOpacity
                                  onPress={ ()=> {
                                      this._invoiceEdit();
                                  }}>
                                 <View>
                                <Text
                                style={styleEdit}
                                >&nbsp; Invoice edition&nbsp;</Text>
                                    </View>
                </TouchableOpacity>
           <TouchableOpacity
                                  onPress={ ()=> {
                                      this._invoiceDisplay();
                                  }}>
                                 <View>
                                <Text
                                style={styleDisplay}
                                >&nbsp; Invoice display&nbsp;</Text>
                                    </View>
                </TouchableOpacity>
           <TouchableOpacity
                                  onPress={ ()=> {
                                      //this._createInvoice();
                                  }}>
                                 <View>
                                <Text
                                style={{ fontWeight : "bold", borderTopRightRadius:3, borderTopLeftRadius : 3, 
                                 borderColor : "#ccc", padding : 6 , fontSize : 20, borderBottomColor : "#ccc",
                                width : subViewWidth, borderBottomWidth : 1}}
                                >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</Text>
                                    </View>
                </TouchableOpacity>







            </View>
                                  {iface}
           </View>

    );
}




scancontact = () => {
  //this.myContacts();
  
  //myContacts = "";
    return (
      <View style={styles.container}>

      <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            Scan an address :
      </Text>
      <Camera
                style={styles.preview}
                onBarCodeRead={this.onBarCodeRead}
                aspect={Camera.constants.Aspect.fill}
                orientation={Camera.constants.Orientation.landscapeLeft}
      ></Camera>
      <View style={{flex: 0.2, backgroundColor: '#4CB676'}}>
      <TouchableOpacity onPress={() => this.setState({ scanningContact : false })}>
            <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              Cancel
            </Text>
          </TouchableOpacity>
      </View>
      </View>

    );
}


scanbill = () => {
  //this.myContacts();
  
  //myContacts = "";
    return (
      <View style={styles.container}>

      <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            Scan a bill :
      </Text>
      <Camera
                style={styles.preview}
                onBarCodeRead={this.onBillBarCodeRead}
                aspect={Camera.constants.Aspect.fill}
                orientation={Camera.constants.Orientation.landscapeLeft}
      ></Camera>
      <View style={{flex: 0.2, backgroundColor: '#4CB676'}}>
      <TouchableOpacity onPress={() => this.setState({ scanningBill : false })}>
            <Text style={{marginTop: '5%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              Cancel
            </Text>
          </TouchableOpacity>
      </View>
      </View>

    );
}


Login = () => {
  console.log("login trigger");
  console.log("lop before:" + this.state.logged);
  AuthLogin(this.state.username, this.state.password).then(
    (response) => {
            console.log("RESPONSE LOGIN = " + JSON.stringify(response));
            if (response.status == 200)
            {
                var respjson = JSON.parse(response._bodyText);
                //console.log("JSON rr = " + JSON.stringify(respjson));
                this.setState({pubkey : respjson.pubkey});
                this.setState({logged : true});
                console.log("Login success, pubkey = " + this.state.pubkey)
                          
            }
            else
            {
            alert("Login failed for some reason ❌");
            console.log("sowhat ?");
            }
        })

  console.log("logged :" + this.state.logged);
  this.RefreshContactList();
}

LogOut = () => {
  console.log("logout trigger");
  console.log("lop before:" + this.state.logged);
  this.setState({logged : false});
  this.setState({balance : 0});
  this.setState({username : ''});
  this.setState({contactlist : '[]'});
  this.setState({latesttransfers: ' '});
  console.log("logged :" + this.state.logged);
}

ft_resetfields_transfer = (array) => {
  var length = array.length

  for (var index = 0; index < length; index++) {
    this.setState({ [array[index]]: "" })
  }
}

ft_paybill = () => {
        //this.setState({ transferPending: true })

          console.log("bill pay normal");
        PayBill(this.state.username, this.state.password, this.state.billaddress) .then(json => {

            console.log("DEBUG: jsontransfer :" + JSON.stringify(json));
            //console.log("DEBUG: jsontransferst :" + json.result);
            var respjson = JSON.parse(json._bodyText);
            if (json.status == 200 && respjson.status == "200")
            {
              alert("Payment successfull ! ✅");
            }
            else
            {
              alert("Payment failed! ❌");
            }

            //this.ft_resetfields_transfer(["transferfrom", "transferto", "transferamount"]);
                this.state.billtotal = "";
                this.state.billaddress = "";
 
          this.setState({transferPending : false});
            //this.refresh_balance();
            //balance: this.ft_balanceOfSafe(json),

    }
    ).catch(error => console.log(error))


    }



ft_transfer = () => {
        this.setState({ transferPending: true })

        if (this.state.transferfrom == "")
        {
          console.log("transfer normal");
          if (this.state.transferto == "0")
          {
              alert("You must specify a user ❌");
              this.setState({transferPending : false});
          }
          else

        TransferTokens(this.state.username, this.state.password, this.state.transferto, this.state.transferamount) .then(json => {

            console.log("DEBUG: ransfer :" + JSON.stringify(json));
            var jsonresp = JSON.parse(json._bodyText);
            if (json.status == 200 && jsonresp.status == "200")
            {
              alert("Transfer successfull ! ✅");
            }
            else
            {
              alert("Transfer failed! ❌");
            }

            this.ft_resetfields_transfer(["transferfrom", "transferamount"]);
          this.setState({transferPending : false});
            //this.refresh_balance();
            //balance: this.ft_balanceOfSafe(json),

    }
    ).catch(error => console.log(error))

        //this.setState({ isLoading: false })
        //this.setState({ name: k })

        }
        else
        {

          console.log("transfer from");
        TransferTokensFrom(this.state.username, this.state.transferto,
        this.state.transferamount, this.state.transferfrom) .then(json => {

            console.log("DEBUG: jsontransfer :" + json);
            console.log("DEBUG: jsontransferst :" + json.result);
            if (json.result == "200")
            {
              alert("Transfer successfull ! ✅");
            }
            else
            {
              alert("Transfer failed! ❌");
            }

            this.ft_resetfields_transfer(["transferfrom", "transferto", "transferamount"]);
            this.setState({transferPending : false});
            //this.refresh_balance();
            //balance: this.ft_balanceOfSafe(json),

    }
    )
            .catch(error => console.log(error))

        //this.setState({ isLoading: false })
        //this.setState({ name: k })

        }

    }

ft_approve = () => {
  console.log("Approve");

  this.setState({ transferPending: true })
  ApproveTokens(this.state.username, this.state.spenderApprove, this.state.tokensApprove)
  .then(ret => {
      console.log("DEBUG: jsontransfer :" + ret);
      console.log("DEBUG: jsontransferst :" + ret.result);
      if (ret.result == "200") {
        alert("Approve successfull ! ✅");
      }
      else {
        alert("Approve failed! ❌");
      }

      this.ft_resetfields_transfer(["spenderApprove", "tokensApprove"]);
      this.setState({transferPending : false});
  })
  .catch(err => console.log("Error ", err))

  console.log("END")
}


 logoutButton = (st) => {
    return (
          <TouchableOpacity onPress={this.LogOut}>
            <Text style={{ textAlign: 'center', fontSize: 21, fontWeight: '100'}}>
              Logged in as : {this.state.username}
            </Text>
          </TouchableOpacity>
    );
}




  render() {
     var login = this.login();
     var qrcode = this.qrcode();
     var logoutButton = this.logoutButton();
     var allowance = this.allowance();
     var balance = this.balance();
     var transfer = this.transfer();
     var contacts = this.contacts();
     var paybill = this.paybill();
     var createbill = this.createbill();
     var scancontact = this.scancontact();
     var scanbill = this.scanbill();


     if (this.state.logged != true)
     {
       return (
        <View style={styles.slide}>
          {login}
        </View>
         );
     }
    else if (this.state.scanningContact == true)
     {
       return (
        <View style={styles.slide}>
          {scancontact}
        </View>
         );
     }

    else if (this.state.scanningBill == true)
     {
       return (
        <View style={styles.slide}>
          {scanbill}
        </View>
         );
     }
     else
     {
    return (
      <Swiper style={styles.wrapper} showsButtons={true} showsPagination={false}>

       <View style={styles.slide}>
          {logoutButton}
          {balance}
        </View>


         <View style={styles.slide}>
          {logoutButton}
          {transfer}
        </View>



        <View style={styles.slide}>
          {logoutButton}
          {contacts}
        </View>

        <View style={styles.slide}>
          {logoutButton}
          {qrcode}
        </View>

       <View style={styles.slide}>
          {logoutButton}
          {paybill}
        </View>

       <View style={styles.slide}>
          {logoutButton}
          {createbill}
        </View>




 {/*
       <View style={styles.slide}>
          {logoutButton}
          {allowance}
        </View>
*/}

      </Swiper>
    );
     }
  }
}

const styles = StyleSheet.create({
    container: {
    marginTop: 42,
    flex: 1,
    width: '100%',
  },
    qrcodecontainer: {
      justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },

  headerStyle: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '100',
  },

  headerSty: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '100',
  },

  elementsContainer: {
    backgroundColor: '#ecf5fd',
    marginTop: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 24
  },
  textInput: {
    height: '50%',
    marginTop: '10%',
    textAlign: 'center',
    fontSize: 42,
    fontWeight: '200',
  },

  balancevalue: {
    textAlign: 'center',
    fontSize: 42,
    fontWeight: '200',
  },

  button: {
    marginTop: 48,
    flex: 1,
    width: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qrcode: {
  //  margin : 'auto',
  },
  scrollview: {
    padding : 20,
    paddingTop : 5,
    borderRadius : 3,
    alignSelf : 'stretch',
    margin : 5,
 },
 preview: {
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center'
}
});
