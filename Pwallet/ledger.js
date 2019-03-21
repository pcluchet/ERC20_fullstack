

const APIURL = 'http://api.plastictwist.com';
const CHANNEL = 'ptwist';
const CHAINCODE = 'ERC20';
const INVOICINGCHAINCODE = 'invoicing';

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
        params: pubkey,
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
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.log('ERROR HAPPENED :' + error);
      });
  };
  
  export const RegInERC20 = (username, password) => {
    return fetch(`${APIURL}/ledger/${CHANNEL}/${CHAINCODE}/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-request-username': username,
        'X-request-password': password
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
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.log('ERROR HAPPENED :' + error);
      });
  };
  
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
        params: pubkey,
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
      .then(response => {
        return response.json();
      })
      .catch(error => {
        console.log('ERROR HAPPENED :' + error);
        console.log(error);
      });
  };
  
  export const AuthLogin = (username, pwd) => {
    return fetch(`${APIURL}/users/${username}/auth`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-request-password': pwd,
      },
      /*
          body: JSON.stringify({
            username: username,
            password: pwd,
          }),
          */
    })
      .then(response => {
        return response.text();
      })
      .catch(error => {
        console.log('ERR ICI :' + error);
      });
  };
  
  export const getAllowancesFrom = username => {
    return fetch(`${APIURL}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Transaction: 'whoOwesMe',
        Id: username,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .catch(error => {
        console.log('ERR LA :' + error);
      });
  };
  
  export const getAllowancesTo = username => {
    return fetch(`${APIURL}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Transaction: 'whoOweI',
        Id: username,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .catch(error => {
        console.log(error);
      });
  };
  
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
        params:
          argarray[0] + '|' + argarray[1] + '|' + 'Triggered from wallet app',
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
      .then(response => {
        return response.json();
      })
      .catch(error => {
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
  };
  
  export const CreateAccount = (username, password) => {
    return fetch(`${APIURL}/users/${username}/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-request-username': username,
        'X-request-password': password,
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
      .then(response => {
        return response;
      })
      .catch(error => {
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
  };
  
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
        params: billid,
      },
    })
      .then(response => {
        return response;
      })
      .catch(error => {
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
  };
  
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
        params: billitmlist,
      },
    })
      .then(response => {
        return response;
      })
      .catch(error => {
        console.log(error);
      });
  };
  
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
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .catch(error => {
        console.log(error);
      });
  };
  
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
      .then(response => response.json())
      .then(responseJson => {
        return responseJson;
      })
      .catch(error => {
        console.log(error);
      });
  };
  