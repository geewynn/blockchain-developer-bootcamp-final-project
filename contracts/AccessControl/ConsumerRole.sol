// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './Roles.sol';

contract ConsumerRole {
    using Roles for Roles.Role;
    Roles.Role private consumer;
    
    event ConsumerAdded(address indexed account, uint timestamp);
    event ConsumerRemoved(address indexed account, uint timestamp);


    modifier onlyConsumer() {
        require(isConsumer(msg.sender), 'only Consumer can call function');
        _;
    }

    constructor() {
        _addConsumer(msg.sender);
    }

    function isConsumer(address _account) public view returns(bool) 
    {
        return consumer.hasRole(_account);
    }

    function _addConsumer(address _account) internal 
    {
        consumer.add(_account);
    }

    function addConsumer(address _account) external onlyConsumer 
    {
        _addConsumer(_account);
        emit ConsumerAdded(_account, block.timestamp);
    }

    function _revokeConsumer(address _account) internal 
    {
        consumer.remove(_account);
    }

    function revokeConsumer(address _account) external onlyConsumer 
    {
        _revokeConsumer(_account);
        emit ConsumerRemoved(_account, block.timestamp);

    }
}
