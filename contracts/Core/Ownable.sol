// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;


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
        return msg.sender == originalOwner;
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
        emit TransferOwnership(originalOwner, address(0));
        originalOwner = address(0);
  }
}