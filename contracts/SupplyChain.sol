// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;


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
    Paid,
    Received,
    Cooked,
    Processed,
    Packed,
    Dispatched,
    DispatchedReceived,
    DispatchSent,
    Confirmed
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
  event LogItemOrder(uint256 upc, uint timestamp);

  // LogItemPaid
  event LogItemPaid(uint256 sku, uint timestamp);

  // LogItemConfirmed
  event LogItemConfirmed(uint256 sku, uint timestamp);

  // LogItemProcessed
  event LogItemProcessed(uint256 sku, uint timestamp);

  // LogItemPacked
  event LogItemPacked(uint256 sku, uint timestamp);

  // LogItemDispatched
  event LogItemDispatched(uint256 sku, uint timestamp);

  // LogitemReceived
  event LogItemReceived(uint256 sku, uint timestamp);

  event LogItemCooked(uint256 sku, uint timestamp);

  event LogDis(uint256 sku, uint timestamp);

  event LogDispatchSent(uint256 sku, uint timestamp);


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

  modifier paid(uint _sku) {
    require(items[_sku].itemState == State.Paid, 'not in paid state');
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
  
  modifier dispatchersent(uint _sku) {
      require(items[_sku].itemState == State.DispatchSent, 'not ready to be sent to consumer');
      _;
  }

  modifier dispatcherreceive(uint _sku) {
      require(items[_sku].itemState == State.DispatchedReceived, 'not ready to be sent to consumer');
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
    address dispatcher = items[_sku].dispatcherID;
    uint price = items[_sku].productPrice;
    uint amountToRefund = msg.value - price;
    (bool success,) = payable(dispatcher).call{value: amountToRefund}('');
    require(success, 'failed to send ether');
  }

  constructor() {
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
    notZeroAddress(_account)
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
      _addDispatcher(_account);
      items[_sku].dispatcherID = _account;
    }

    function enableConsumerAccount(uint _sku, address _account) public onlyDispatcher checkSKU(_sku) notZeroAddress(_account) {
      _addConsumer(_account);
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

    
    function PayForItem(uint _sku) public payable checkSKU(_sku) paidEnough(items[_sku].productPrice) checkValue(_sku) ordered(_sku) onlyConsumer {
      address consumer = msg.sender;
      items[_sku].consumerID = consumer;
      address restaurant = items[_sku].originRestaurantID;
      uint price = items[_sku].productPrice;
      items[_sku].itemState = State.Paid;
      (bool succes, ) = payable(restaurant).call{value: price}('');
      require(succes, 'failed to send ether to restaurant');
      emit LogItemPaid(_sku, block.timestamp);
    }


    function ReceiveOrder(uint _sku) public checkSKU(_sku) paid(_sku) onlyRestaurant {
      items[_sku].itemState = State.Received;
      emit LogItemReceived(_sku, block.timestamp);
    }


    function CookOrder(
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
        originRestaurantID: owner,
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


    function ReceiveDispatchedOrder(uint _sku) public checkSKU(_sku) dispatch(_sku) onlyDispatcher  {
      items[_sku].itemState = State.DispatchedReceived;
      transferOwnershipToDispatcher(_sku, msg.sender);
      emit LogDis(_sku, block.timestamp);
    }


    function DispatcherDispatchesOrder(uint _sku) public checkSKU(_sku)  dispatcherreceive(_sku) onlyDispatcher  {
      items[_sku].itemState = State.DispatchSent;
      emit LogDispatchSent(_sku, block.timestamp);
    }


    function ConsumerReceivesItem(uint _sku) public checkSKU(_sku) dispatchersent(_sku) onlyConsumer  {
      items[_sku].itemState = State.Confirmed;
      // transferOwnershipToConsumer(_sku, msg.sender);
      emit LogItemConfirmed(_sku, block.timestamp);
    }


    function getItemStatus(uint _sku) public checkSKU(_sku) view returns(string memory status) {
    uint itemStatus = uint(items[_sku].itemState);
    if(itemStatus == 0) {
        status = 'Ordered';
    } else if(itemStatus == 1) {
        status = 'Paid';
    } else if(itemStatus == 2) {
        status = 'Received';
        
    }  else if(itemStatus == 3) {
        status = 'Cooked';
    }
    else if(itemStatus == 4) {
        status = 'Processed';
    } else if(itemStatus == 5) {
        status = 'Packed';
    } else if(itemStatus == 6) {
        status = 'Dispatched';
    } else if(itemStatus == 7) {
        status = 'DispatchedReceived';
    } else if(itemStatus == 8) {
        status = 'DispatchSent';
    } else if(itemStatus == 9) {
        status = 'Confirmed';
    }
    
  }
  
    
  function getTotalItems() public view returns(uint) {
    return sku;
  }
  
  
  function getOwner() public view returns(address) {
    return owner;
  }

  function getItemOwner(uint _sku) checkSKU(_sku) public view returns(address) {
    return items[_sku].ownerID;
  }


  function fetchRestaurantDetails(uint _upc)  public view returns (
    uint itemSKU,
    address ownerID,
    address originRestaurantID,
    string memory originRestaurantInfo,
    string memory originRestaurantName
  )
  {
    require(_upc > 0, 'sku cannot be 0');
    return (
      items[_upc].sku,
      items[_upc].ownerID,
      items[_upc].originRestaurantID,
      items[_upc].originRestaurantInfo,
      items[_upc].originRestaurantName
    );
      
  }
  
  
    
  function fetchProductDetails(uint _upc)  public checkSKU(_upc) view returns (
    uint itemSKU,
    uint itemUPC,
    uint productID,
    string memory productNotes,
    uint productPrice,
    string memory status,
    address dispatcherID,
    address consumerID
    ) {
      itemSKU = items[_upc].sku;
      itemUPC = items[_upc].upc;
      productID = items[_upc].productID;
      productNotes = items[_upc].productNotes;
      productPrice = items[_upc].productPrice;
      uint itemState = uint(items[_upc].itemState);
     if(itemState == 0) {
        status = 'Ordered';
    } else if(itemState == 1) {
        status = 'Paid';
    } else if(itemState == 2) {
        status = 'Received';
        
    }  else if(itemState == 3) {
        status = 'Cooked';
    }
    else if(itemState == 4) {
        status = 'Processed';
    } else if(itemState == 5) {
        status = 'Packed';
    } else if(itemState == 6) {
        status = 'Dispatched';
    } else if(itemState == 7) {
        status = 'DispatchedReceived';
    } else if(itemState == 8) {
        status = 'DispatchSent';
    } else if(itemState == 9) {
        status = 'Confirmed';
    } 
      dispatcherID = items[_upc].dispatcherID;
      consumerID = items[_upc].consumerID;
  }

}
