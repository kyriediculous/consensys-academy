const Token = artifacts.require('Token')

const INITIAL_MINT = process.env.INITIAL_MINT || web3.utils.toWei('100', 'ether')

module.exports = deployer => deployer.then( async () => {
    const coinbase = (await web3.eth.getAccounts())[0]
    const token = await deployer.deploy(Token, "Academy Token", "ACA", 18)
    await token.mint(coinbase, INITIAL_MINT)
})