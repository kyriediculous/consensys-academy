const Marketplace = artifacts.require('Marketplace')
const Staking = artifacts.require('Staking')

const SELLER_STAKE = process.env.SELLER_STAKE || web3.utils.toWei('10')

module.exports = deployer => deployer.then(async () => {
    const staking = await Staking.deployed()
    await deployer.deploy(Marketplace, staking.address, SELLER_STAKE)
})