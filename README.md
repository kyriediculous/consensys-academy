# EthBooks: ConsenSys Academy Project 

## EthBooks 

EthBooks is a very simple implementation of a decentralized marketplace. The idea is that self-publishing authors can sell their work to the public without having to go through expensive intermediaries such as amazon kindle, who charge 30% commission on royalties as well as employ a 60-day billing period. 

I'm actually building this for real: [The Saga Project](www.sagaproject.org )

The flow is somewhat similar to the marketplace user stories in the assignment document with some minor changes. 

### Marketplace 
When a user opens up the app he will see the marketplace and can browse listings, the user does not have to authenticate with uport or enable metamask.

### Buying Listings 
Listings have the option to pay with either uport or metamask. When the user clicks the buy button the respective transaction approval process will start.
For uport this means approving the transaction on the mobile app, for metamask a transaction popup will appear (if the user has metamask privacy settings enabled, metamask will first ask authorization to access the user's account).

### Dashboard 
The dashboard is the 'profile page' of the user. When a user navigates to this page a modal will pop up to connect to the dApp with either uport or metamask. After connecting the user dashboard will appear. If the user cancels the modal he will be returned to the marketplace. On the dashboard the user can see a purchase history, stake tokens to gain seller permissions (or unstake tokens if the user does not wish to sell items any longer), view and edit his/her listings and create new listings. 

### Creating Listings 
A user can create new listings from the dashboard. In order to be able to create listings a user must stake a certain amount of tokens. The token and minimum staking amount is decided by the deployer of Marketplace.sol. 

### Staking 
Staking tokens is required to gain permissions to create and have purchasable listings. A user can add or remove staked tokens in his dashboard. 
If a user has active listings while unstaking his tokens, his listings will no longer be purchasable. 

### Differences from marketplace in assignment
* There is no store admin that dictates who get to create listings (or a storefront). 
* Seller permissions are done through staking of an ERC20 token, designated by the marketplace
* There is no reduction of quantity when an item gets bought (eBooks are unlimited digital assets)

### Buying Listings is a Happy Flow 
The "Buy" flow currently ends with an event being emitted and the ebook the user bought opening up in a new tab in his browser (if pop-ups are allowed).
This is of course not secure in the real world. 

In a real world setting the ebook itself would be encrypted before upload. 
Vendors would be required to run a server-application which includes a swarm-node and an event listener.
This service needs to be online to be able to send the decryption keys over PSS to the buyer. 
Buyers would have an in-app swarm client available (either through a child process with electron apps, or if a full swarm implementation in javascript is written from a service worker)

When `LogBuy` gets emitted, the event listener would pick up on this and send a message over PSS (swarm) to the buyer with the decryption keys. 
The Buyer has a light swarm client running that can pick up on the messages if the user is online. 
For guarantee of delivery buyers would need to register their (partial) swarm node address.

## Swarm 

> Swarm is a distributed storage platform and content distribution service, a native base layer service of the ethereum web3 stack. The primary objective of Swarm is to provide a sufficiently decentralized and redundant store of Ethereum’s public record, in particular to store and distribute dapp code and data as well as blockchain data. From an economic point of view, it allows participants to efficiently pool their storage and bandwidth resources in order to provide these services to all participants of the network, all while being incentivised by Ethereum.

From [Swarm official documentation](https://swarm-guide.readthedocs.io/en/latest/introduction.html)

This sounds similar to IPFS, the major difference being that IPFS uses LibP2P as peer-to-peer protocol and Swarm uses Devp2p just like ethereum. It also uses keccak256 as hashing algorithm just like ethereum. This means content hashes are 32 bytes long and can be easily put in a contract without having to base58 encode it first (like with IPFS hashes). Swarm is in an earlier development phase than swarm but offers some interesting features such as messaging (PSS), feeds (mutable resources) and native integration with ethereum under the form of swap, swear and swindle altough there is much uncertainty about the latter two. There's also talks of Ethereum moving to Libp2p as it is actively being developed as THE p2p protocol for the web 3.0. So maybe Swarm might eventually merge with IPFS in the future if ethereum migrates to libp2p, who knows. 

## ENS 

The web application lives on the public swarm testnet and the content hash is registered on rinkeby ENS. 

## On the double use of the swarm manifest hash as mapping index and id 
In Marketplace.sol , the swarm manifest hash of a listing is used as the index in the mapping of all listings.
This form of double referencing is usually frowned upon in programming, for good reason. But there's actually arguments to be made for double referencing when using deterministic content hashes.

The most common pattern used in simple smart contracts is using an incrementing value in the contract's state. 
This would slightly increase gas costs, altough only marignal since constantinople release. 

The second problem is that method doesn't let us check for existing id's (and thus duplicate content) without the use of loops and arrays. Which is a pattern I try to avoid as much as possible. 

## Potential Upgrades 

### Update Listing Manifest 
I didn't include this out of time constraints on the client side (Fulltime job and next weekend I'll be at ethParis), the functionality is in the contract however.
A listing owner can update the image, ebook or/and metadata of his listing by removing and adding resources to the existing listing manifest.
This will return a new 32-byte keccak256 hash of the listing manifest, which can then be set on chain. 

### Shopping Cart 
We could create shopping cart functionality by utilizing batch transactions. 

### Reports & dispute resolvement 
Analogous to staking to be a seller we can also implement a staking mechanism as well as economic incentive for users who wish to handle reports and disputes. 
It will sound vaguely familiar :).

When a report is made a round-based commit/reveal voting mechanism will start. 
There will be a minimum vote tally, if the minimum amount of votes is not reached within a certain timeframe (synchrony assumptions), a new roubd with a slightly lower tally will start. 
There will be a a minimum majority of 2/3+1 , if no majority is reached a new round will start.
If a seller is found guilty a portion of his stake will be slashed and distributed among the majority voters. 
Additionally, voters that voted against the 2/3rd+1 majority will also get slashed for a portion of their stake to be distributed among the correctly voting majority.


## Issues Encountered 

### EthPM & open-zeppelin
When I first started developing the project I had installed the open-zeppelin libraries through EthPM.
Sadly the latest version of open-zeppelin on `npm` differs greatly from the one on `ethPM`. 
Even though they just released a new version, the ethPM registry still points to the old version.

Therefore I just imported the contracts I needed from that library manually. 

### Web3JS 
I encountered multiple issues when working with versions beyond web3js 1.0.0-beta34. 
The most important being that it uses a wrong version for xhr. 

I switched back to my favorite ethereum libary, ethers.js, for the remainder of the project. 

### Uport 

* When the IPFS Infura gateway is not reachable, the QR modal to authenticate does not show. This happened on multiple occasions. 

* uport seems to fail on `eth_estimateGas` when transactions have contract-to-contract calls in them, resulting in an insufficient funds error when trying to confirm transactions. This could be due to an outdated version of the mobile app, I'm not entirely sure.
`ERC20.approve()` works fine when signing with uport, but invoking the function on a contract which then calls `ERC20.transferFrom()` will result in the error. Probably a default gas amount needs to be set when `eth_estimateGas` Fails, and uport should let the user enter transaction parameters under the 'advanced' tab.

* Mobile app not always responsive to requests. 

### Swarm

I'm a big fan of the Swarm project as it forms a critical part of the decentralized infrastructure. Despite it's amazing potential it is still in proof-of-concept phase. 
This means there can be a few quirks here an there. For example, uploading already existing resources to the public swarm gateway will result in a CORS error currently, whereas in previous versions (eg 0.3.8) it returned the existing hash.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## Truffle 

### Compile Contracts 
```
truffle compile 
```

### Migrate Contracts
```
truffle migrate 
```

### Test Contracts 
```
truffle test
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).