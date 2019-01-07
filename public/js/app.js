App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  displayAccountEtherInfo: function () {
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        web3.eth.getBalance(account, function (err, balance) {
          if (err === null) {
            console.log(web3.fromWei(balance, "ether") + " ETH");
          }
        })
      }
    });
  },

  initContract: function () {
    $.getJSON('EduCoin.json', function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var EduCoinArtifact = data;
      App.contracts.EduCoin = TruffleContract(EduCoinArtifact);

      // Set the provider for our contract.
      App.contracts.EduCoin.setProvider(App.web3Provider);

      //listen to events
      App.listenToEvent();

      // Use our contract to retieve and mark the adopted pets.
      return App.getBalances();
    });

    return App.bindEvents();
  },

  bindEvents: function () {
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#payfeesButton', App.payFees);
    $(document).on('click', '#buytokensButton', App.buyTokens);
    $(document).on('click', '#transactionhistoryButton', App.getTransactionHistory);
  },

  handleTransfer: function (event) {
    event.preventDefault();

    var amount = parseInt($('#TTTransferAmount').val());
    var toAddress = $('#TTTransferAddress').val();

    console.log('Transfer ' + amount + ' TT to ' + toAddress);

    var EduCoinInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EduCoin.deployed().then(function (instance) {
        EduCoinInstance = instance;

        return EduCoinInstance.transfer(toAddress, amount, {
          from: account,
          gas: 100000
        });
      }).then(function (result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  getTransactionHistory: function () {
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      var api_URL = "http://api.etherscan.io/api?module=account&action=txlist&address=0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef&startblock=0&endblock=99999999&sort=asc&apikey=MCWI4J364YYZA3VBUM6DS8DJ51AEIPGVR9";
      var Request = require("../../node_modules/request");

      Request.get(api_URL, (error, response, body) => {
        if (error) {
          return console.dir(error);
        }
        console.dir(JSON.parse(body));
      });
    });
  },

  payFees: function () {
    event.preventDefault();

    var _amount = parseInt($('#TTTransferAmount').val());
    var _schoolAddress = $('#TTTransferAddress').val();
    var _reference = $('#TTTransferReference').val(); //pass the reference value here

    if ((_schoolAddress == '0x0') || (_amount == 0)) {
      // no fees to pay
      return false;
    }

    App.contracts.EduCoin.deployed().then(function (instance) {
      return instance.payFees(_schoolAddress, _amount, _reference, {
        from: App.account,
        gas: 500000
      });
    }).then(function (result) {

    }).catch(function (err) {
      console.error(err);
    });
  },

  buyTokens: function () {
    event.preventDefault();

    var _amount = parseInt($('#TTTransferAmount').val());

    App.contracts.EduCoin.deployed().then(function (instance) {
      return instance.buyToken({
        from: App.account,
        value: web3.toWei(_amount, "ether"),
        gas: 500000
      });
    }).catch(function (error) {
      console.error(error);
    });
  },

  getBalances: function () {
    console.log('Getting balances...');

    var EduCoinInstance;

    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.EduCoin.deployed().then(function (instance) {
        EduCoinInstance = instance;

        return EduCoinInstance.balanceOf(account);
      }).then(function (result) {
        balance = result.c[0];

        $('#TTBalance').text(balance);
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  //listen to events triggered by the contract
  listenToEvent: function () {
    App.contracts.EduCoin.deployed().then(function (instance) {
      instance.NewSchoolAdded({}, {}).watch(function (error, event) {
        if (!error) {
          console.log(event.args._schoolName);
        } else {
          console.error(error);
        }
      });

      instance.FeesPayed({}, {}).watch(function (error, event) {
        if (!error) {
          console.log(event.args._schoolName);
        } else {
          console.error(error);
        }
        App.getBalances();
      });
    })
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});