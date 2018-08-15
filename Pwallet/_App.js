import React, { Component } from 'react';
import { Text, TextInput, Icon , TouchableOpacity, ScrollView, View, StyleSheet,
  ActivityIndicator,
} from 'react-native';
//import { Constants } from 'expo';
import Swiper from 'react-native-swiper';
import TimerMixin from 'react-timer-mixin';
import QRCode from 'react-native-qrcode';


const APIURL = "http://192.168.0.3:8085";

export const getUserBalance = (username) => {
    return fetch(`${APIURL}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Transaction: "balanceOf",
          Id: username,
          TokenOwner: username,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
}

export const AuthLogin = (username, pwd) => {
    return fetch(`${APIURL}/auth`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: pwd,
        }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
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
            console.error(error);
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
            console.error(error);
        });
}

export const TransferTokens = (username, to, amount) => {
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
            console.error(error);
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
            console.error(error);
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
            console.error(error);
        });

}

export default class App extends Component {
  constructor(props) {
    super(props)
      
    this.interval = setInterval(() => {
      //this.ft_getbalance();
      //this.ft_getAllowancesFrom();
      //this.ft_getAllowancesTo();
    }, 6500);




    this.state = {
      password : 'hello',
      pubkey : 'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE1DNpAmf0qJ/XN0U1OkFucbGwbOfj7ukvPdnzmnlbi26Sme1MRKspetZNK9+uJpXx4+fjj3kncsSFUIBMaBgOMA==',
      logged : true,
      name: '',
      username: 'john',
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
      BalanceIsLoading: false, // la requête API est-elle en cours ?
      UserListIsLoading: false // la requête API est-elle en cours ?
    }
  }
  
////////////////////////////////////////////////////////////////////////////////
//  Transfer
////////////////////////////////////////////////////////////////////////////////

  transferbtn = (str) => {
    if (this.state.transferPending) {
      return (<ActivityIndicator size="large" color="#0000ff" style={{textAlign: 'center', fontWeight: '100', marginTop: '10%'}}/>)
    }
    else {
      return (
        <Text style={{marginTop: '10%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
          {str}
        </Text>
      )
    }
  }
  
  transfer = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>Transfer</Text>
        <View style={{ position: 'absolute', top: 10, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        </View>

        <View style={[{flex: 3}, styles.elementsContainer]}>
        <View style={{flex: 1, backgroundColor: '#d9d9d9'}}>
          <TextInput style={{height: '50%', marginTop: '10%', textAlign: 'center', fontSize: 42, fontWeight: '200'}}
            placeholder="From"
            onChangeText={(transferfrom) => this.setState({ transferfrom })}
            value={this.state.transferfrom}>
          </TextInput>
        </View>
        <View style={{flex: 1, backgroundColor: '#e6e6e6'}}>
          <TextInput style={styles.textInput}
            placeholder="To"
            onChangeText={(transferto) => this.setState({ transferto })}
            value={this.state.transferto}>
          </TextInput>
        </View>
        <View style={{flex: 1, backgroundColor: '#f2f2f2'}}>
          <TextInput style={styles.textInput}
            placeholder="Tokens"
            onChangeText={(transferamount) => this.setState({ transferamount })}
            value={this.state.transferamount}>
          </TextInput>
        </View>
      </View>

      <View style={styles.button}>
      <View style={{flex: 1, backgroundColor: '#ffc2b3'}}>
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
        .catch(error => console.error(error))
      }
    }
    
    ft_getAllowancesTo = () => {
      if (this.state.username !== "") {
        getAllowancesTo(this.state.username)
        .then((json) => this.setState({allowancesTo: this.ft_balanceOfSafe(json)}))
        .catch(error => console.error(error))
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
      <View style={styles.container}>
        <Text style={styles.headerStyle}>Balance</Text>
        <View style={{ position: 'absolute', top: 10, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
        </View>


        <View style={[{flex: 3}, styles.elementsContainer]}>
        <View style={{flex: 1, backgroundColor: '#9DD6EB'}}>
          <Text style={styles.textInput}> {this.state.balance} </Text>
        </View>
        <View style={{flex: 1, backgroundColor: '#d9d9d9'}}>
          <Text style={{fontSize: 20, textAlign: 'center', fontWeight: 'bold', marginTop: '2%'}}>
            Allowances From
          </Text>
          <ScrollView  style={styles.scrollview}>
            <Text style={{fontSize: 20, textAlign: 'left', fontWeight: '100'}}>
            {allowancesFrom}
            </Text>
          </ScrollView>
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
        if (json.result == 200) {
            return json.body;
        }
        else
            return "0"
    }

  ft_getbalance = () => {
    if (this.state.username !== "") {
        getUserBalance(this.state.username).then(
          json => this.setState({
            balance: this.ft_balanceOfSafe(json),
        }))
            .catch(error => console.error(error))
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
      <View style={{flex: 1, backgroundColor: '#ffc2b3'}}>
          <TouchableOpacity onPress={this.Login }>
            <Text style={{marginTop: '10%', textAlign: 'center', fontSize: 42, fontWeight: '100'}}>
              Login
            </Text>
          </TouchableOpacity>

        </View>
      </View>
      </View>
    );
}


  qrcode = () => {
    console.log("PUBKEY = " + this.state.pubkey);
    return (
      <View style={styles.container}>
        <Text style={styles.headerStyle}>My address :</Text>


      <View style={styles.qrcodecontainer}>
      <QRCode style={styles.qrcode}
          value={this.state.pubkey}
          size={300}
          bgColor='black'
          fgColor='white'/>
      </View>
      </View>
    );
}





Login = () => {
  console.log("login trigger");
  console.log("lop before:" + this.state.logged);
  AuthLogin(this.state.username, this.state.password).then(
    (responseJson) => {
            console.log("RESPONSE LOGIN = " + JSON.stringify(responseJson));
            if (responseJson.status == "ok")
            {

                this.setState({pubkey : responseJson.pubkey});
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
}

LogOut = () => {
  console.log("logout trigger");
  console.log("lop before:" + this.state.logged);
  this.setState({logged : false});
  this.setState({username : ''});
  console.log("logged :" + this.state.logged);
}

ft_resetfields_transfer = (array) => {
  var length = array.length

  for (var index = 0; index < length; index++) {
    this.setState({ [array[index]]: "" })
  }
}

ft_transfer = () => {
        this.setState({ transferPending: true })

        if (this.state.transferfrom == "")
        {
          console.log("transfer normal");
        TransferTokens(this.state.username, this.state.transferto, this.state.transferamount) .then(json => {

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
    ).catch(error => console.error(error))

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
            .catch(error => console.error(error))

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
  .catch(err => console.error("Error ", err))

  console.log("END")
}


 logoutButton = (st) => {
    return (
          <TouchableOpacity onPress={this.LogOut}>
            <Text style={{marginTop: '10%', textAlign: 'center', fontSize: 21, fontWeight: '100'}}>
              Username : {this.state.username}
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

     if (this.state.logged != true)
     {
       return (
        <View style={styles.slide}>
          {login}
        </View>
         );
     }
     else
     {
    return (
      <Swiper style={styles.wrapper} showsButtons={true} showsPagination={false}>

        <View style={styles.slide}>
          {logoutButton}
          {qrcode}
        </View>
        <View style={styles.slide}>
          {logoutButton}
          {balance}
        </View>

       <View style={styles.slide}>
          {logoutButton}
          {allowance}
        </View>

         <View style={styles.slide}>
          {logoutButton}
          {transfer}
        </View>


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
    fontSize: 36,
    textAlign: 'center',
    fontWeight: '100',
    marginBottom: 24
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
  button: {
    marginTop: 48,
    flex: 1,
    width: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
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
    flex: 1,
 },
});
