## Design Pattern Decisions

### Circuit Breaker (requirement) 

Staking.sol implements a circuit breaker (Pausable.sol) by which the contract owner can pause or unpause staking/unstaking of tokens. 

## Upgradeability 

I have not included upgradeabilitiy in this project as it would be somewhat trivial, since Marketplace.sol is a monolith contract. 

We could make Marketplace.sol upgradeable through a proxy for example, I have included one in the contracts folder for demonstration purposes.
In order to implement this we would have to: 
 * add the following two lines under `/// CONTRACT STATE` in Marketplace.sol so the storage interfaces of the contracts are identical.
 ```
   address public owner;
  address public impl;
 ```
 * Change the constructor into a regular function which is then called after deploying the Proxy contract. This can be done in the migrations or through a Factory contract. 

I've written two blogposts on upgradeability in the past including code
* Same architecture as implemented here: https://hackernoon.com/upgradeable-ethereum-contracts-v2-786d9c18cd9d
* Five types model https://hackernoon.com/upgradeable-smart-contracts-a7e9aef76fdd

## On the double use of the swarm manifest hash as mapping index and id 
In Marketplace.sol , the swarm manifest hash of a listing is used as the index in the mapping of all listings.
This form of double referencing is usually frowned upon in programming, for good reason. But there's actually arguments to be made for double referencing when using deterministic content hashes.

The most common pattern used in simple smart contracts is using an incrementing value in the contract's state. 
This would slightly increase gas costs, altough only marignal since constantinople release. 

The second problem is that method doesn't let us check for existing id's (and thus duplicate content) without the use of loops and arrays. Which is a pattern I try to avoid as much as possible.

