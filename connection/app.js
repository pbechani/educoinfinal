const contract = require('truffle-contract');

const EduCoinArtifact = require('../build/contracts/EduCoin.json');
var EduCoin = contract(EduCoinArtifact);

module.exports = {
  start: function (callback) {
    var self = this;

    // Bootstrap the EduCoin abstraction for Use.
    EduCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },

  refreshBalance: function (account, callback) {
    var self = this;

    // Bootstrap the EduCoin abstraction for Use.
    EduCoin.setProvider(self.web3.currentProvider);

    var edu;
    EduCoin.deployed().then(function (instance) {
      edu = instance;
      return edu.balanceOf.call(account, {
        from: account
      });
    }).then(function (value) {
      callback(value.valueOf());
    }).catch(function (e) {
      console.log(e);
      callback("Error 404");
    });
  },

  payFees: function (amount, sender, reference, receiver, callback) {
    var self = this;

    // Bootstrap the EduCoin abstraction for Use.
    EduCoin.setProvider(self.web3.currentProvider);

    var edu;
    EduCoin.deployed().then(function (instance) {
      edu = instance;
      return edu.sendCoin(receiver, amount, reference, {
        from: sender
      });
    }).then(function () {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  handleTransfer: function (amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the EduCoin abstraction for Use.
    EduCoin.setProvider(self.web3.currentProvider);

    var edu;
    EduCoin.deployed().then(function (instance) {
      edu = instance;
      return edu.transfer(receiver, amount, {
        from: sender,
        gas: 100000
      });
    }).then(function () {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  },

  addSchool: function (schoolAddress, schoolName, schoolType, registered, callback) {
    var self = this;

    // Bootstrap the EduCoin abstraction for Use.
    EduCoin.setProvider(self.web3.currentProvider);

    var edu;
    EduCoin.deployed().then(function (instance) {
      edu = instance;
      return edu.addSchool(schoolAddress, schoolName, schoolType, registered, {
        from: sender,
        gas: 100000
      });
    }).then(function () {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function (e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}