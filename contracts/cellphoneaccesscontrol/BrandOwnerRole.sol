pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'DistributorRole' to manage this role - add, remove, check
contract BrandOwnerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event BrandOwnerAdded(address indexed account);
  event BrandOwnerRemoved(address indexed account);

  // Define a struct 'farmers' by inheriting from 'Roles' library, struct Role
  Roles.Role private brandowners;

  // In the constructor make the address that deploys this contract the 1st farmer
  constructor() public {
    _addBrandOwner(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyBrandOwner() {
    require(isBrandOwner(msg.sender));
    _;
  }

  // Define a function 'isFarmer' to check this role
  function isBrandOwner(address account) public view returns (bool) {
    return brandowners.has(account);
  }

  // Define a function 'addFarmer' that adds this role
  function addBrandOwner(address account) public onlyBrandOwner {
    _addBrandOwner(account);
  }

  // Define a function 'renounceFarmer' to renounce this role
  function renounceBrandOwner() public {
    _removeBrandOwner(msg.sender);
  }

  // Define an internal function '_addFarmer' to add this role, called by 'addFarmer'
  function _addBrandOwner(address account) internal {
    brandowners.add(account);
    emit BrandOwnerAdded(account);
  }

  // Define an internal function '_removeFarmer' to remove this role, called by 'removeFarmer'
  function _removeBrandOwner(address account) internal {
    brandowners.remove(account);
    emit BrandOwnerRemoved(account);
  }
}