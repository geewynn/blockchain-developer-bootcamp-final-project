// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


import './AccessControl/ConsumerRole.sol';
import './AccessControl/RestaurantRole.sol';
import './AccessControl/DispatcherRole.sol';

import './Core/Ownable.sol';

contract SupplyChain is RestaurantRole, DispatcherRole, ConsumerRole, Ownable {

  // define owner
  address owner;

  address deployer;

  // 'upc' universal product code
  uint upc;

  // 'sku' stock keeping unit
  uint sku;

  mapping (uint => Item) items;

  enum State {
    Ordered,
    Payed,
    Cooked,
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
      address dispatcherID;
      address consumerID;
  }


  // LogItemOrder
  event LogItemOrder(uint256 upc);

  // LogItemPayed
  event LogItemPayed(uint256 sku, uint timestamp);

  // LogItemConfirmed
  event LogItemConfirmed(uint256 sku, uint timestamp);

  // LogItemProcessed
  event LogItemProcessed(uint256 sku, uint timestamp);

  // LogItemPacked
  event LogItemPacked(uint256 sku, uint timestamp);

  // LogItemDispatched
  event LogItemDispatched(uint256 sku, uint timestamp);

  // LogitemReceived
  event LogitemReceived(uint256 sku, uint timestamp);

  event LogItemCooked(uint256 sku, uint timestamp);


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
    require(items[_sku].itemState == State.Ordered, 'not in ordered state');
    _;
  }

  modifier payed(uint _sku) {
    require(items[_sku].itemState == State.Payed, 'not in payed state');
    _;
  }

  modifier cooked(uint _sku) {
    require(items[_sku].itemState == State.Cooked, 'not in cooked state');
    _;
  }

  modifier processed(uint _sku) {
    require(items[_sku].itemState == State.Processed, 'not in processed state');
    _;
  }
  
  modifier confirmed(uint _sku) {
      require(items[_sku].itemState == State.Confirmed, 'status: not confirmed by consumer');
      _;
  }

  modifier packed(uint _sku) {
      require(items[_sku].itemState == State.Packed, 'not in packed state');
      _;
  }

  modifier dispatch(uint _sku) {
      require(items[_sku].itemState == State.Dispatched, 'not ready for dispatch');
      _;
  }

  modifier received(uint _sku) {
      require(items[_sku].itemState == State.Received, 'not in received state');
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

  function transferOwnershipToAccount(address _account) public onlyOwner notZeroAddress(_account) {
      owner = _account;
      transferOwnership(_account);
    }

  function addRestaurantAccount(uint _sku, address _account) 
    public
    onlyOwner
    notZeroAddress
    {
      _addRestaurant(_account);
      items[_sku].ownerID = _account;
      transferOwnershipToAccount(_account);
    }


    function transferOwnershipToDispatcher(uint _sku, address _account) notZeroAddress(_account) public {
      address dispatcher = items[_sku].dispatcherID;
      require(_account == dispatcher, 'must be ready to be dispatched');
      owner = dispatcher;
    }


    function enableDisapatcherAccount(uint _sku, address _account) public checkSKU(_sku) notZeroAddress(_account) {
      addDispatcher(_account);
      items[_sku].dispatcherID = _account;
    }

    function enableConsumerAccount(uint _sku, address _account) public onlyDispatcher checkSKU(_sku) notZeroAddress(_account) {
      enableConsumer(_account);
      items[_sku].consumerID = _account;
    }



    function transferOwnershipToConsumer(uint _sku, address _account) public notZeroAddress(_account) {
      address consumer = items[_sku].consumerID;
      require(_account == consumer, 'consumer account must be existing');
      owner = consumer;
      items[_sku].ownerID = consumer;
    }

  // comeback to this
    function OrderItem(
      uint _sku
      ) public onlyConsumer {
        items[_sku].itemState = State.Ordered;
        emit LogItemOrder(sku, block.timestamp);
      }

    
    function PayForItem(uint _sku) public checkSKU(_sku) ordered(_sku) onlyConsumer {
      items[_sku].itemState = State.Payed;
      emit LogItemPayed(_sku, block.timestamp);
    }


    function ReceiveOrder(uint _sku) public checkSKU(_sku) payed(_sku) onlyRestaurant {
      items[_sku].itemState = State.Received;
      emit LogitemReceived(_sku, block.timestamp);
    }


    function CookOrder(
      string memory _originRestaurantID, 
      string memory _originRestaurantName, 
      string memory _originRestaurantInfo,
      string memory _productNotes
    ) public onlyRestaurant {
      sku += 1;
      uint productID = upc + sku;
      items[sku] = Item({
        sku: sku,
        upc: sku,
        ownerID: owner,
        originRestaurantID: _originRestaurantID,
        originRestaurantName: _originRestaurantName,
        originRestaurantInfo: _originRestaurantInfo,
        productID: productID,
        productNotes: _productNotes,
        productPrice: 0,
        itemState: State.Cooked,
        dispatcherID: address(0),
        consumerID: address(0)
      });

      emit LogItemCooked(sku, block.timestamp);
    }

    function ProcessOrder(uint _sku) public checkSKU(_sku) cooked(_sku) onlyRestaurant  {
      items[_sku].itemState = State.Processed;
      emit LogItemProcessed(_sku, block.timestamp);
    }

    function PackageOrder(uint _sku) public checkSKU(_sku) processed(_sku) onlyRestaurant  {
      items[_sku].itemState = State.Packed;
      emit LogItemPacked(_sku, block.timestamp);
    }

    function DispatchOrder (uint _sku) public checkSKU(_sku) packed(_sku) onlyRestaurant  {
      items[_sku].itemState = State.Dispatched;
      emit LogItemDispatched(_sku, block.timestamp);
    }


    function ReceiveDispatchedOrder() public checkSKU(_sku) dispatched(_sku) onlyDispatcher  {
      items[_sku].itemState = State.Dispatched;
      transferOwnershipToDispatcher(_sku, msg.sender);
      emit LogitemReceived(_sku, block.timestamp);
    }


    function DispatcherDispatchesOrder () public checkSKU(_sku) dispatched(_sku) onlyDispatcher  {
      items[_sku].itemState = State.Dispatched;
      emit LogItemDispatched(_sku, block.timestamp);
    }


    function ConsumerReceivesItem () public checkSKU(_sku) dispatched(_sku) onlyDispatcher  {
      items[_sku].itemState = State.Dispatched;
      transferOwnershipToConsumer(_sku, msg.sender);
      emit LogItemConfirmed(_sku, block.timestamp);
    }

}
