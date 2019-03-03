const Staking = artifacts.require('Staking')
const Marketplace = artifacts.require('Marketplace')
const Token = artifacts.require('Token')

module.exports = deployer => deployer.then(async () => {
    const market = await Marketplace.deployed()
    const token = await Token.deployed() 
    const staking = await Staking.deployed()

    await token.approve(staking.address, web3.utils.toWei('10', 'ether'))
    await staking.stake(web3.utils.toWei('10', 'ether'))

    // Create Kafka 
    await market.createListing('0x645edeaa2971ca68209ba582d7d39aca0eb029b6da33179699a76c1446b12ffc', token.address, web3.utils.toWei('5', 'ether'), true)
    // Create Cicero 
    await market.createListing('0xcd1bb3670085479cb6e83cba89697d96bc189030adcb3d32369658984f3d20f3', token.address, web3.utils.toWei('15', 'ether'), true)
    // Create The Quick Brown Fox 
    await market.createListing('0x2357d03a48ce662e8e079db2028101fc2cbb005b54c8fe8fef5c82cce5b1c272', token.address, web3.utils.toWei('10', 'ether'), true)
})

// Kafka 
// https://swarm-gateways.net/bzz-list:/645edeaa2971ca68209ba582d7d39aca0eb029b6da33179699a76c1446b12ffc/

// Cicero
// https://swarm-gateways.net/bzz-list:/cd1bb3670085479cb6e83cba89697d96bc189030adcb3d32369658984f3d20f3/

// The Quick Brown Fox 
// https://swarm-gateways.net/bzz-list:/2357d03a48ce662e8e079db2028101fc2cbb005b54c8fe8fef5c82cce5b1c272/
