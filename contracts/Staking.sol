pragma solidity ^0.5.1;

import './util/SafeMath.sol';
import './util/IERC20.sol';
import './util/Pausable.sol';

/// @title Staking simplified EIP-900 interface without history support or thawing
contract Staking is Pausable {
    /// LIBRARIES 
    using SafeMath for uint256;
    
    /// EVENTS
    event LogStake(address indexed user, uint256 amount, uint256 total);
    event LogUnstake(address indexed user, uint256 amount, uint256 remaining);

    /// CONTRACT STATE 
    IERC20 public token;
    mapping (address => uint256) public stakes;
    
    /// @notice constructor 
    /// @param _token Token that can be staked.
    constructor(address _token) public {
        require(_token != address(0x0), "Error: constructor requires token address");
        token = IERC20(_token);
    }
    
    /// @notice Fallback completely reverts 
    function () external {
        revert();
    }

    /// @notice Stakes a certain amount of tokens.
    /// @param _amount Amount of tokens to stake.
    function stake(uint256 _amount) public whenNotPaused {
        stakeFor(msg.sender, _amount);
    }

    /// @notice Stakes a certain amount of tokens for another user.
    /// @param _user Address of the user to stake for.
    /// @param _amount Amount of tokens to stake.
    function stakeFor(address _user, uint256 _amount) public whenNotPaused {
        stakes[_user] = stakes[_user].add(_amount);
        require(token.transferFrom(msg.sender, address(this), _amount), "Error: not enough tokens approved");
        emit LogStake(_user, _amount, stakes[_user]);
    }

    /// @notice Unstakes a certain amount of tokens.
    /// @param _amount Amount of tokens to unstake.
    function unstake(uint256 _amount) public whenNotPaused {
        require(stakes[msg.sender] >= _amount, "Error: unstake amount is larger than stake");
        stakes[msg.sender] = stakes[msg.sender].sub(_amount);
        require(token.transfer(msg.sender, _amount), "Error: Could not transfer tokens");
        emit LogUnstake(msg.sender, _amount, stakes[msg.sender]);
    }

}
