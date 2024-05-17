// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Faucet is ERC20{

    constructor()
        ERC20("ChatzToken", "CZT")
    {}

    mapping(address =>uint256) lastMintTimestamp;
    mapping(address =>bool) membership;
    event TokenMinted(address indexed user, uint256 amount); 
    event Balance(address indexed user, uint256 balance);

    function mintDailyAmount() external {
        require(!membership[msg.sender] || block.timestamp - lastMintTimestamp[msg.sender] >= 1 hours,"You have already mined within an hour");
        membership[msg.sender] = true;
        
        _mint(msg.sender, 20*10**18);
        emit TokenMinted(msg.sender,20*10**18);
        lastMintTimestamp[msg.sender] = block.timestamp;
    }

    function theBalance() external view returns(uint256){
       return balanceOf(msg.sender);
    }

    function generatejoke() external {
        require(balanceOf(msg.sender)>=2*10**18,"Not enough tokens");
        _burn(msg.sender, 2*10**18);
        emit Balance(msg.sender,balanceOf(msg.sender));
    }
}