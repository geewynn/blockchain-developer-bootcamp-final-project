// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;


library Roles {
    struct Role {
        mapping (address => bool) bearer;
    }

    function hasRole(Role storage role, address _account) internal view returns(bool) {
        require(_account != address(0));
        return role.bearer[_account];
    }


    function add(Role storage role, address _account) internal {
        require(_account != address(0), 'cannot add hole');
        require(!hasRole(role, _account), 'account must not have role');
        role.bearer[_account] = true;
    }


    function remove(Role storage role, address _account) internal {
        require(_account != address(0), 'address cannot be black hole');
        require(hasRole(role, _account), 'address must have role');
        role.bearer[_account] = false;
    }

}