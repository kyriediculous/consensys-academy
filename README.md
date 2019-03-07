# EthBooks: ConsenSys Academy Project

## EthBooks

EthBooks is a very simple implementation of a decentralized marketplace. The idea is that self-publishing authors can sell their work to the public without having to go through expensive intermediaries such as amazon kindle, who charge 30% commission on royalties as well as employ a 60-day billing period.

I'm actually building this for real: [The Saga Project](www.sagaproject.org )

The flow is somewhat similar to the marketplace user stories in the assignment document with some minor changes.

### Pages

#### Marketplace
When a user opens up the app he will see the marketplace and can browse listings, the user does not have to authenticate with uport or enable metamask.
![marketplace](https://github.com/kyriediculous/consensys-academy/blob/master/readme-assets/marketplace.PNG)

#### Dashboard
The dashboard is the 'profile page' of the user. When a user navigates to this page a modal will pop up to connect to the dApp with either uport or metamask. After connecting the user dashboard will appear. If the user cancels the modal he will be returned to the marketplace. On the dashboard the user can see a purchase history, stake tokens to gain seller permissions (or unstake tokens if the user does not wish to sell items any longer), view and edit his/her listings and create new listings.
![connect](https://github.com/kyriediculous/consensys-academy/blob/master/readme-assets/connect.PNG)

### User Actions

#### Buying Listings
Listings have the option to pay with either uport or metamask. When the user clicks the buy button the respective transaction approval process will start.
For uport this means approving the transaction on the mobile app, for metamask a transaction popup will appear (if the user has metamask privacy settings enabled, metamask will first ask authorization to access the user's account).
![listing details](https://github.com/kyriediculous/consensys-academy/blob/master/readme-assets/listing.PNG)

#### Creating Listings
A user can create new listings from the dashboard. In order to be able to create listings a user must stake a certain amount of tokens. The token and minimum staking amount is decided by the deployer of Marketplace.sol.

#### Updating Listings
A user can update a listing in his dashboard. Currently functionality is included on the client to update price and 'active' status. Functionality to update the manifest and thus title, summary, image is in the contract, but not on the client side due to time constraints.

#### Removing Listings
A user can "remove" listings. This will merely clear the `listings` mapping in Marketplace.sol at the given `id` , it does not clear the blockchain's history, neither does it remove the resources from Swarm.
Only if the resources on swarm are ever garbage collected they are removed, this can happen when the resources aren't requested over a certain period of time (GC not implemented yet in swarm).

In essence removing a listing has the same effect as making it inactive, with the addition of possible removal in the future AND  the listing not showing up anymore in 'Your listings'.

From the swarm docs:

> Even though there is no guarantees for removal, unaccessed content that is not explicitly insured will eventually disappear from the Swarm, as nodes will be incentivised to garbage collect it in case of storage capacity limits.

#### Staking / Unstaking
Staking tokens is required to gain permissions to create and have purchasable listings. A user can add or remove staked tokens in his dashboard.
If a user has active listings while unstaking his tokens, his listings will no longer be purchasable.
![dashboard](https://github.com/kyriediculous/consensys-academy/blob/master/readme-assets/dashboard.PNG)

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

## Potential Upgrades

### Update Listing Manifest
I didn't include this out of time constraints on the client side (Fulltime job and next weekend I'll be at ethParis), the functionality is in the contract however.
A listing owner can update the image, ebook or/and metadata of his listing by removing and adding resources to the existing listing manifest.
This will return a new 32-byte keccak256 hash of the listing manifest, which can then be set on chain.

I did write a method for it and submitted an issue to the erebos.js swarm library for Swarm by the Mainframe team so they can add it to their API: https://github.com/MainframeHQ/erebos/issues/86

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

## Swarm (IPFS Replacement)

> Swarm is a distributed storage platform and content distribution service, a native base layer service of the ethereum web3 stack. The primary objective of Swarm is to provide a sufficiently decentralized and redundant store of Ethereum’s public record, in particular to store and distribute dapp code and data as well as blockchain data. From an economic point of view, it allows participants to efficiently pool their storage and bandwidth resources in order to provide these services to all participants of the network, all while being incentivised by Ethereum.

From [Swarm official documentation](https://swarm-guide.readthedocs.io/en/latest/introduction.html)

This sounds similar to IPFS, the major difference being that IPFS uses LibP2P as peer-to-peer protocol and Swarm uses Devp2p just like ethereum. It also uses keccak256 as hashing algorithm just like ethereum. This means content hashes are 32 bytes long and can be easily put in a contract without having to base58 encode it first (like with IPFS hashes). Swarm is in an earlier development phase than IPFS but offers some interesting features such as messaging (PSS), feeds (mutable resources) and native integration with ethereum under the form of swap, swear and swindle altough there is much uncertainty about the latter two. There's also talks of Ethereum moving to Libp2p as it is actively being developed as THE p2p protocol for the web 3.0. So maybe Swarm might eventually merge with IPFS in the future if ethereum migrates to libp2p, who knows.

Example usage:

Uploading some text returns the hash

```
$ curl -H "Content-Type: text/plain" --data "some-data" http://localhost:8500/bzz:/
> 027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39
```

We can download our uploaded text

```
$ curl http://localhost:8500/bzz:/027e57bcbae76c4b6a1c5ce589be41232498f1af86e1b1a2fc2bdffd740e9b39/
```

In this application the [erebos.js](https://erebos.js.org) bzz-api is used to interact with Swarm at the public swarm testnet gateway (swarm-gateways.net)

We can easily upload our `/dist` folder to Swarm recursively and set the default path to resolve at index.html:

`swarm --defaultpath index.html --recursive up dist`

The web application itself is deployed onto the swarm public testnet, visit it at https://swarm-gateways.net/bzz:/1cf86ccd15eb1ea2b6661e56cb1a843f99083a347a3541a1a403b88f1c514639/#/

## ENS

The content hash for the web application is registered on rinkeby and ropsten ENS.

https://manager.ens.domains/name/ethbooks.test

After building and uploading our `/dist` folder to Swarm we get the manifest hash back.
We can register this content hash on ENS. That way we can use the ENS name instead of manifest hash to resolve our application.

For more please check https://swarm-guide.readthedocs.io/en/latest/gettingstarted.html#how-do-i-enable-ens-name-resolution

The public swarm gateway points to the Ethereum Main Net though, and we are using rinkeby. We will thus not be able to resolve the ENS Name of our content via the public swarm gateway.

It is possible though when running your own swarm node connected to the testnet.

`swarm --bzzaccount $BZZACCOUNT --datadir $DATADIR --ens-api test:<0xe7410170f87102df0055eb195163a03b7f2bff4a>@https://rinkeby.infura.io`

We can then resolve by visting `http://localhost:8500/bzz:/ethbooks.test/`

## Uport: VuePort truffle box

Before creating this certification project I decided to generalize some boilerplate code for using uport authentication and transaction signatures and make it available through a truffle box.

I did this because VueJS is exploding right now, especially in Asia. Despite that there was only a react-uport box, which was outdated as well.

The box can be found at https://github.com/saga-foundation/vueport-box or installed with `truffle unbox saga-foundation/vueport-box`.

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
Synchronization of chunks between nodes isn't always very performant either. After uploading the web application to my local swarm node I had to wait quite a while before it came available on the public gateway. 



## Project setup

### Rinkeby
The contracts are already deployed to the Rinkeby testnet.
* [Marketplace.sol](https://rinkeby.etherscan.io/address/0x3A6eda57cd46b46671A7A868Ab30a3E5865d76A1)
* [Staking.sol](https://rinkeby.etherscan.io/address/0x705d5F5221789d69F3BF32597245cdFfe4025541)
* [Token.sol](https://rinkeby.etherscan.io/address/0x46F1A4Dd99bd8D2d6be032C328a54778e1517358)

### Web Application
Deployed on swarm testnet at https://swarm-gateways.net/bzz:/1cf86ccd15eb1ea2b6661e56cb1a843f99083a347a3541a1a403b88f1c514639/

###  Environment variables
ENV Vars can be found in the `.env` file.
If you wish to build for a specific network either on dev server or as a build make sure you change `VUE_APP_NETWORK` to the corresponding network as defined in `@/src/util/networks.js` as well as `VUE_APP_SWARM` to your gateway of choice.
The app is configured to run against the swarm public gateway. If you want to play around it's advisable to set up a singleton swarm node (see swarm docs) and change the swarm host in the environment variables.

You can also set `VUE_APP_DEFAULT_TOKEN` to the token used in the staking contract, it will then default to that token in the Create Listing form.

### Install dependencies
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

### Reset networks
```
truffle networks --clean
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Running Locally
