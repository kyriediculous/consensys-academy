pragma solidity ^0.5.1;

contract Proxy {
  address public owner;
  address public impl;
  constructor (address _impl) public {
      impl = _impl;
      owner == msg.sender;
  }
  /**
  * @notice Fallback function allowing to perform a delegatecall to the given implementation.
  * This function will return whatever the implementation call returns
  */
  function () public {
    require(msg.sig != 0x0);
    address _impl = impl;
    assembly {
      let ptr := mload(0x40)
      calldatacopy(ptr, 0, calldatasize)
      let result := delegatecall(gas, _impl, ptr, calldatasize, ptr, 0)
      let size := returndatasize
      returndatacopy(ptr, 0, size)

      switch result
      case 0 { revert(ptr, size) }
      default { return(ptr, size) }
    }
  }
  
  function upgrade(address _impl) {
    require(msg.sender == owner);
    impl = _impl;
  }

}