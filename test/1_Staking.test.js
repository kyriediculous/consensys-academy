const Token = artifacts.require('Token')
const Staking = artifacts.require('Staking')

const assertRevert = async promise => {
    try {
      await promise
      assert.fail('Expected error not received')
    } catch (error) {
      const rev = error.message.search('revert') >= 0
      assert(rev, `Expected "revert", got ${error.message} instead`)
    }
  }

contract('Staking.sol', () => {
  before(async () => {
    // Deploy ERC20 token
    this.token = await Token.new('EthAcademy', 'EDU', 18)
    // Deploy staking contract
    this.staking = await Staking.new(this.token.address)
    // Get coinbase account
    this.coinbase = (await web3.eth.getAccounts())[0]
    // Set an arbitrary BN amount to use
    this.amount = web3.utils.toBN(web3.utils.toWei('5', 'ether'))
    // Mint 'amount' to 'coinbase'
    await this.token.mint(this.coinbase, this.amount)
  })

  it(`Should let me add a stake
        substracting the amount of tokens from my balance
        and adding them to the balance of the smart contract`,
    async () => {
        // Approve tokens to staking contract
        await this.token.approve(this.staking.address, this.amount)
        // Call ERC20.transferfrom from staking contract and update its state
        await this.staking.stake(this.amount)
        // My stake should now equal the staked amount
        assert.equal(this.amount.toString(10), (await this.staking.stakes(this.coinbase)).toString(10))
        // My balance should now be 0 , I staked 5 tokens after minting 5 tokens to myself in the before() hook
        assert.equal('0', (await this.token.balanceOf(this.coinbase)).toString(10))
        // The token balance of the staking contract should now equal the staked amount
        assert.equal(this.amount.toString(10), (await this.token.balanceOf(this.staking.address)).toString(10))
    }
  )

  it(`Should let me unstake a staked amount
        reducing my stake by the amount
        and adding those tokens back to my token balance`,
    async () => {
        //Unstake 5 tokens again
        await this.staking.unstake(this.amount)
        // My balance should equal 5 again
        assert.equal(this.amount.toString(10), (await this.token.balanceOf(this.coinbase)).toString(10))
        // My stakes should equal 0 again the the staking contract state
        assert.equal('0', (await this.staking.stakes(this.coinbase)).toString(10))
    }
  )

  it(`Should let the contract owner pause the staking contract
        Preventing any staking or unstaking from going on`,
    async () => {
        await this.staking.pause()
        assert.equal(await this.staking.paused(), true)
        await this.token.approve(this.staking.address, this.amount)
        // Calling stake/unstake while the contract is paused should result in a revert 
        await assertRevert(this.staking.stake(this.amount))
    }
  )
})
