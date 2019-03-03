pragma solidity ^0.5.1;

import {Staking} from './Staking.sol';
import './util/IERC20.sol';
import './util/Ownable.sol';

contract Marketplace is Ownable {

    /// EVENTS 
    event LogCreateListing(bytes32 indexed listing, address indexed seller, address token, uint256 price, bool active);
    event LogRemoveListing(bytes32 indexed listing, bytes32 reason);
    event LogBuy(bytes32 indexed listing, address indexed buyer, uint price, address token,  uint timestamp);
    event LogChangeSellerStake(uint256 sellerStake);
    event LogChangePrice(bytes32 indexed listing, uint256 newPrice, address newToken);
    
    /// MODIFIERS 
    modifier isSeller(bytes32 _listing) {
        require(msg.sender == listings[_listing].seller, "Error: Unauthorized");
        _;
    }
    
    /// STRUCT DEFINITIONS 
    struct Listing {
         bytes32 id;        // Swarm hash
         IERC20 token;      // Token to accept
         uint256 price;     // Price in wei format 
         address seller;    // Seller 
         bool active;       // Active or Inactive 
    }
    
    /// CONTRACT STATE 
    Staking public staking;                          // The implemented staking contract 
    uint256 public sellerStake;                      // The staking treshold to be a seller 
    mapping(bytes32 => Listing) private listings;    // Mapping containing all listings (id => Listing)
    
    /// @notice constructor is called upon creation of contract 
    /// @param _staking address of the associated staking contract 
    /// @param _sellerStake Stake required to be a seller 
    constructor(address _staking, uint256 _sellerStake) public {
       uint codeLength;
        assembly {
            // Retrieve the size of the code on target address 
            codeLength := extcodesize(_staking)
        }
        // Check if code exists at target address
        require(codeLength > 0, "Error: Staking contract not deployed at given address");
        staking = Staking(_staking);
        sellerStake = _sellerStake;
    }
    
    /// @notice Change the stake treshold required to be a seller 
    /// @param _sellerStake the new stake treshold in wei format 
    /// @dev can only be called by contract owner 
    function changeSellerStake(uint256 _sellerStake) public onlyOwner {
        sellerStake = _sellerStake;
        emit LogChangeSellerStake(_sellerStake);
    }

    /// @notice Check whether someone has enough tokens staked to be considered a seller 
    /// @param _user Ethereum address of the user 
    /// @return authorizedSeller true or false 
    function isStakedSeller(address _user) public view returns (bool authorizedSeller) {
        return staking.stakes(_user) >= sellerStake;
    }
    
    /// @notice Create a new listing 
    /// @param _id the listing id (swarm hash) 
    /// @param _token the address of the token the listing is priced in
    /// @param _price the price of the listing 
    /// @param _activate activate the listing upon creation true/false 
    function createListing(bytes32 _id, address _token, uint256 _price, bool _activate) public {
        // Require that seller has staked enough tokens 
        require(isStakedSeller(msg.sender), "Error: Not enough stake");
        // Require that listing doesn't already exist 
        require(listings[_id].id == bytes32(0x0), "Error: Listing already exists");
        // Create new listing
        listings [_id ]= Listing(_id, IERC20(_token), _price, msg.sender, _activate);
        // Emit event to compile list of all listings on the client side
        emit LogCreateListing(_id, msg.sender, _token, _price, _activate);
    }
    
    /// @notice Change a listing's active status
    /// @param _id the listing id (swarm hash)
    function changeListingStatus(bytes32 _id) public isSeller(_id) {
        listings[_id].active = !listings[_id].active;
    }

    /// @notice Change a listing's price and/or token 
    /// @param _Id the listing id (swarm hash) 
    /// @param _price the new price (leave blank or the same number to only update token)
    /// @param _token the new token (leave blank or the same address to only update price)
    function changeListingPrice(bytes32 _id, uint256 _price, address _token) public isSeller(_id) {
        if (_token != address( listings[_id].token) || _token != address(0)) listings[_id].token = IERC20(_token); 
        if ( _price != listings[_id].price && _price > 0 ) listings[_id].price = _price;
        emit LogChangePrice(_id, listings[_id].price, address(listings[_id].token));
    }

    /// @notice Get a listing's metadata by its id 
    /// @param _id the swarm hash of the listing 
    /// @return Listing struct as a tuple 
    function getListing(bytes32 _id) 
        public
        view 
        returns (
            bytes32 id,
            address token,
            uint256 price,
            address seller,
            bool active
            ) {
        return (
            _id,
            address(listings[_id].token),
            listings[_id].price,
            listings[_id].seller,
            listings[_id].active
        );
    }
    
    /// @notice Remove a listing 
    /// @param _id the listing id (swarm hash)
    /// @param _reason swarm hash with a string containing the reason for removal (optional)
    function removeListing(bytes32 _id, bytes32 _reason) public isSeller(_id) {
        delete listings[_id];
        emit LogRemoveListing(_id, _reason);
    }

    /// @notice Buy a listing 
    /// @param _id the listing id (swarm hash) 
    /// @dev requires ERC20.approve() by buyer first 
    function buyListing(bytes32 _id) public {
        // Listing must be active 
        require(listings[_id].active, "Error: Listing not active");
        // Can not buy from an unstaked seller 
        require(isStakedSeller(listings[_id].seller),  "Error: Seller has no stake");
        // Buyer must have approved enough tokens 
        require(IERC20(listings[_id].token).transferFrom(msg.sender, listings[_id].seller, listings[_id].price), "Error: not enough tokens approved");
        // Emit buy event 
        emit LogBuy(_id, msg.sender, listings[_id].price, address(listings[_id].token), now);
    }
    
}