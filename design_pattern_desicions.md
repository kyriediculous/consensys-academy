## Design Pattern Decisions

### Circuit Breaker (requirement) 

Staking.sol implements a circuit breaker (Pausable.sol) by which the contract owner can pause or unpause staking/unstaking of tokens. 

### Upgradeability through Proxy

Both Staking.sol and Marketplace.sol are contracts that can live on their own. They can however, also be upgradeable if the contracts are addressed through their proxies.
The proxies will be executed in context of their respective 'master' contracts. The 'master' contracts can be replaced as long as the storage definitions remains identical.

There is however a gas cost tradeoff involved as each transaction will cost slightly more gas, as an extra inter-contract call needs to happen. 

I wrote two blog posts on the concept of upgradeability: 
- [Proxy](https://hackernoon.com/upgradeable-ethereum-contracts-v2-786d9c18cd9d)
- [Concern Seperation](https://hackernoon.com/upgradeable-smart-contracts-a7e9aef76fdd)

