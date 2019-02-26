const Token = artifacts.require('Token')
const Staking = artifacts.require('Staking')

module.exports = (deployer, accounts, network) => deployer.then(async () => {
    const token = await Token.deployed()
    await deployer.deploy(Staking, token.address)
})