// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import './Roles.sol';

contract RestaurantRole {
    using Roles for Roles.Role;
    Roles.Role private restaurant;
    
    event RestaurantAdded(address indexed account);
    event RestaurantRemoved(address indexed account);


    modifier onlyRestaurant() {
        require(isRestaurant(msg.sender), 'only restaurant can call function');
        _;
    }

    constructor() {
        _addRestaurant(msg.sender);
    }

    function isRestaurant(address _account) public view returns(bool) 
    {
        return restaurant.hasRole(_account);
    }

    function _addRestaurant(address _account) internal 
    {
        restaurant.add(_account);
        emit RestaurantAdded(_account);
    }

    function addRestaurant(address _account) external onlyRestaurant 
    {
        _addRestaurant(_account);
    }

    function _revokeRestaurant(address _account) internal 
    {
        restaurant.remove(_account);
        emit RestaurantRemoved(_account);
    }

    function _removeRestaurant(address _account) external onlyRestaurant 
    {
        _revokeRestaurant(_account);
    }
}
