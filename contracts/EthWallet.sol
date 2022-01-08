// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EthWallet {
    address public owner;
    
    constructor(address _owner) {
        owner = _owner;
    }
    
    receive() external payable {}

    function deposit() payable public {
    }
    
    function send(address payable _to, uint256 _amount) public onlyOwner {
        _to.transfer(_amount);
    } 
    function balanceOf() view onlyOwner public returns(uint256) {
        return address(this).balance;
    }

    function withdraw(uint256 _amount) public onlyOwner {
        payable(msg.sender).transfer(_amount);
    }

    modifier onlyOwner {
        require(msg.sender == owner, 'only the owner can call wallet functions');
        _;
    }
}