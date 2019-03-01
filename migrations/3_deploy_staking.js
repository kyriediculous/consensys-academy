const Token = artifacts.require('Token')
const Staking = artifacts.require('Staking')

module.exports = (deployer) => deployer.then(async () => {
    const token = await Token.deployed()
    await deployer.deploy(Staking, token.address)
})
