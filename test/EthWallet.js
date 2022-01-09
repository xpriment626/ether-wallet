const EthWallet = artifacts.require("EthWallet");

contract("EthWallet", (accounts) => {
    let ethInstance = null;
    before(async () => {
        ethInstance = await EthWallet.deployed();
    });
    it("Should set acounts[0] as owner", async () => {
        const owner = await ethInstance.owner();
        assert(owner === accounts[0]);
    });

    it("Should deposit eth to EthWallet", async () => {
        await ethInstance.deposit({
            from: accounts[0],
            value: 100,
        });
        const balance = await web3.eth.getBalance(ethInstance.address);
        assert(parseInt(balance) === 100);
    });

    it("Should return the balance of the contract", async () => {
        const balance = await ethInstance.balanceOf();
        assert(parseInt(balance) === 100);
    });
    it("Should transfer eth to another address", async () => {
        const balanceRecipientOld = await web3.eth.getBalance(accounts[1]);
        await ethInstance.send(accounts[1], 50, { from: accounts[0] });
        const balanceWallet = await web3.eth.getBalance(ethInstance.address);
        assert(parseInt(balanceWallet) === 50);

        const balanceRecipient = await web3.eth.getBalance(accounts[1]);
        const finalBalance = web3.utils.toBN(balanceRecipient);
        const initialBalance = web3.utils.toBN(balanceRecipientOld);

        assert(finalBalance.sub(initialBalance).toNumber() === 50);
    });
    it("Should not transfer eth if tx not sent from owner", async () => {
        try {
            await ethInstance.send(accounts[1], 50, { from: accounts[2] });
        } catch (e) {
            assert(
                e.message.includes("only the owner can call wallet functions")
            );
            return;
        }
        assert(false);
    });
    it("Should not allow withdrawals exceeding contract balance", async () => {
        try {
            await ethInstance.withdraw(500);
        } catch (e) {
            assert(e.message.includes("insufficient balance"));
        }
    });
});
