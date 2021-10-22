// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

import './Roles.sol';

contract DispatcherRole {
    using Roles for Roles.Role;
    Roles.Role private dispatcher;
    
    event DispatcherAdded(address indexed account, uint timestamp);
    event DispatcherRemoved(address indexed account, uint timestamp);


    modifier onlyDispatcher() {
        require(isDispatcher(msg.sender), 'only Dispatcher can call function');
        _;
    }

    constructor() {
        _addDispatcher(msg.sender);
    }

    function isDispatcher(address _account) public view returns(bool) 
    {
        return dispatcher.hasRole(_account);
    }

    function _addDispatcher(address _account) internal 
    {
        dispatcher.add(_account);
    }

    function addDispatcher(address _account) external onlyDispatcher 
    {
        _addDispatcher(_account);
        emit DispatcherAdded(_account, block.timestamp);
    }

    function _revokeDispatcher(address _account) internal 
    {
        dispatcher.remove(_account);
    }

    function revokeDispatcher(address _account) external onlyDispatcher 
    {
        _revokeDispatcher(_account);
        emit DispatcherRemoved(_account, block.timestamp);

    }
}
