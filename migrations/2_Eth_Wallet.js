const EthWallet = artifacts.require("EthWallet");

module.exports = function (deployer, _network, accounts) {
    deployer.deploy(EthWallet, accounts[0]);
};
