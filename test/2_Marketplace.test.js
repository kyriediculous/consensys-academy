const Token = artifacts.require('Token')
const Staking = artifacts.require('Staking')
const Marketplace = artifacts.require('Marketplace')

const assertRevert = async promise => {
    try {
      await promise
      assert.fail('Expected error not received')
    } catch (error) {
      const rev = error.message.search('revert') >= 0
      assert(rev, `Expected "revert", got ${error.message} instead`)
    }
  }

contract('Marketplace.sol', () => {
    before( async () => {
        // Deploy ERC20 token
        this.token = await Token.new('EthAcademy', 'EDU', 18)
        // Deploy staking contract
        this.staking = await Staking.new(this.token.address)
        // Set staking treshold
        this.sellerStake = web3.utils.toBN(web3.utils.toWei('5', 'ether'))
        // Deploy marketplace
        this.marketplace = await Marketplace.new(this.staking.address, this.sellerStake)
        // Get coinbase account
        this.coinbase = (await web3.eth.getAccounts())[0]
        // Set an arbitrary BN amount to use
        this.amount = web3.utils.toBN(web3.utils.toWei('100', 'ether'))
        // Mint 'amount' to 'coinbase'
        await this.token.mint(this.coinbase, this.amount)
        // Mock listing
        this.listing = [web3.utils.soliditySha3('Hello Listing'), this.token.address, web3.utils.toBN(web3.utils.toWei('1', 'ether')), true]
    })

    it('Does not let me create a listing when I do not have stake', async () => {
        // creating a listing without stake should result in a revert of the tx
        await assertRevert(this.marketplace.createListing(...this.listing))
        // Helper function to determine whether seller has stake should return false
        assert.equal(false, await this.marketplace.isStakedSeller(this.coinbase), "Seller has no stake")
    })

    it('Lets me create a listing after I have staked the adequate amount', async () => {
        // Stake tokens
        await this.token.approve(this.staking.address, this.sellerStake)
        await this.staking.stake(this.sellerStake)
        // compare stake requirement vs my current stake (bignumbers)
        assert(this.sellerStake.eq(await this.staking.stakes(this.coinbase)), "Not enough tokens staked")
        // If previous test passes I should be able to create a listing now
        await this.marketplace.createListing(...this.listing)
        const listing = await this.marketplace.getListing(this.listing[0])
        //check if the listing is what I made 
        assert.equal(this.listing[0], listing.manifest, "Listing id's do not match")
        assert.equal(this.listing[1], listing.token, "Listing token addresses do not match")
        assert(this.listing[2].eq(listing.price, "Listing prices do not match"))
    })

    it('Lets me buy an existing, activated listing', async () => {
        await this.token.approve(this.marketplace.address, this.listing[2])
        assert.equal((await this.token.allowance(this.coinbase, this.marketplace.address)).toString(10), this.listing[2])
        const tx = await this.marketplace.buyListing(this.listing[0])
        assert(tx.logs.find(log => log.event === "LogBuy") !== undefined, "No Buy event fired on transaction")
    })
})
