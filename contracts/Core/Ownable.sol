// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract Ownable {
    address private originalOwner;
    event TransferOwnership(address indexed oldOwner, address indexed newOwner);

    constructor() {
        originalOwner = msg.sender;
        emit TransferOwnership(address(0), originalOwner);
    }


    function ownerAccount() public view returns(address) {
        return originalOwner;
    }


    function isOwner() public view returns(bool) {
        return msg.sender == origOwner;
    }

    modifier onlyOwner() {
        require(isOwner(), 'only owner can call function');
        _;
    }

    function _transferOwnership(address newOwner_) internal {
        require(newOwner_ != address(0), 'cannot transfer to addr 0');
        originalOwner = newOwner_;
        emit TransferOwnership(originalOwner, newOwner_);
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        _transferOwnership(_newOwner);
    }

    function renounceOwnership() public onlyOwner {
        emit TransferOwnership(origOwner, address(0));
        origOwner = address(0);
  }
}