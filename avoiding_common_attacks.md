# Avoiding Common Attacks 

## Integer overflow and underflow 

All critical arithmetic operations in all contracts are done using the community vetted SafeMath.sol library contract by Open-Zeppelin

## Re-Entrancy 

By using the Checks-Effects-Interactions pattern we can mitigate re-entrancy attacks. 

The unstake function in Staking.sol is a perfect example of this 

```

    function unstake(uint256 _amount) public whenNotPaused {
        // CHECK 
        require(stakes[msg.sender] >= _amount, "Error: unstake amount is larger than stake");
        // EFFECT 
        stakes[msg.sender] = stakes[msg.sender].sub(_amount);
        // INTERACTION 
        require(token.transfer(msg.sender, _amount), "Error: Could not transfer tokens");
        emit LogUnstake(msg.sender, _amount, stakes[msg.sender]);
    }
```

## Block gas limit 

By avoiding the implementation of any loops we significantly reduce the risk of running into block gas limit attacks that can block the contract.

Instead of working with in contract arrays to keep track of collections we prefer to handle this on the client side through events if such contract statee is not necessary for inter-contract interactions.