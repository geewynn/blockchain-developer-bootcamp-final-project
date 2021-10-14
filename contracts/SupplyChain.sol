// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SupplyChain {

  // define owner
  address public owner;

  // 'upc' universal product code
  uint upc;

  // 'sku' stock keeping unit
  uint sku;

  mapping (uint => Item) items;

  enum State {
    Ordered,
    Payed,
    Confirmed,
    Processed,
    Packed,
    Dispatched,
    Received
  }

  struct Item {
      uint sku;
      uint upc;
      address ownerID;
      address originRestaurantID;
      string originRestaurantName;
      string originRestaurantInfo;
      uint productID;
      string productNotes;
      uint productPrice;
      State itemState;
      address distributorID;
      address retailerID;
      address consumerID;
  }


  // LogItemOrder
  event LogItemOrder(uint256 upc);

  // LogItemPayed
  event LogItemPayed(uint256 upc);

  // LogItemConfirmed
  event LogItemConfirmed(uint256 upc);

  // LogItemProcessed
  event LogItemProcessed(uint256 upc);

  // LogItemPacked
  event LogItemPacked(uint256 upc);

  // LogItemDispatched
  event LogItemDispatched(uint256 upc);

  // LogitemReceived
  event LogitemReceived(uint256 upc);


  modifier notZeroAddress(address _account) {
     require(_account != address(0), 'cannot be black hole account');
     _;
 }
  
  modifier checkSKU(uint _sku) {
      require(_sku > 0, 'sku cannot be 0');
      _;
  }

  modifier verifyCaller(address _account) {
      require(msg.sender == _account, 'unauthorized');
      _;
  }

  modifier ordered(uint _sku) {
    require(items[_sku].itemState == State.Ordered, 'not in harvested state');
    _;
  }

  modifier payed(uint _sku) {
    require(items[_sku].itemState == State.Payed, 'not in processed state');
    _;
  }

  modifier processed(uint _sku) {
    require(items[_sku].itemState == State.Processed, 'not in packed state');
    _;
  }
  
  modifier confirmed(uint _sku) {
      require(items[_sku].itemState == State.Confirmed, 'status: not up for sale');
      _;
  }

  modifier packed(uint _sku) {
      require(items[_sku].itemState == State.Packed, 'status: not up for sale');
      _;
  }

  modifier dispatch(uint _sku) {
      require(items[_sku].itemState == State.Dispatched, 'status: not up for sale');
      _;
  }

  modifier received(uint _sku) {
      require(items[_sku].itemState == State.Received, 'status: not up for sale');
      _;
  }
  
    modifier paidEnough(uint _price) {
    require(msg.value >= _price, 'amount paid must be higher than item price');
    _;
  }
  
  modifier checkValue(uint _sku) {
      _;
      address distributor = items[_sku].distributorID;
    uint price = items[_sku].productPrice;
    uint amountToRefund = msg.value - price;
    (bool success,) = payable(distributor).call{value: amountToRefund}('');
    require(success, 'failed to send ether');
  }

  constructor() public {
    deployer = msg.sender;
    owner = msg.sender;
    sku = 0;
    upc = 0;
  }


  function kill() public {
    if(msg.sender == owner) {
      selfdestruct(payable(owner));
    }
  }

  function addRestaurantAccount(uint _sku, address _account) 
    public
    onlyOwner
    notZeroAddress
    {
      _addRestaurant(_account);
    }




}
