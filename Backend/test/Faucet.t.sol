// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Faucet} from "../src/Faucet.sol";

contract Faucet_Test is Test{
    Faucet public faucet;

    function setUp() public{
        faucet = new Faucet();
    }

    function test_mintDailyAmount() public{
        faucet.mintDailyAmount();
        assertEq(faucet.theBalance(), 20*10**18 );
    }

    function test_generateJoke() public {
        vm.expectRevert("Not enough tokens");
        faucet.generatejoke();
        
    }
    
    function test_balance() public{
        faucet.mintDailyAmount();
        faucet.generatejoke();
        assertEq(faucet.theBalance(), 18*10**18);
    }

function test_timeInterval() public {
    faucet.mintDailyAmount();
    vm.expectRevert("You have already mined within an hour"); 
    faucet.mintDailyAmount();
}



}