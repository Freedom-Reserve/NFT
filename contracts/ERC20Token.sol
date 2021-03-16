//"SPDX-License-Identifier: MIT"
pragma solidity ^0.7.5;
import "./openzeppelinERC20.sol";

interface Interface_TDD {
    function check1(address _eoa) external view returns (bool _isGood);
}

contract ERC20Token is ERC20 {

    constructor(string memory name, string memory symbol, uint8 decimals) ERC20(name, symbol, decimals) {
      _mint(msg.sender, 80*(10**(decimals+6)));//base 18
    }

    fallback() external {
        console.log("no function matched");
        revert("no function matched");
    }
}
        //console.log("success:",success,", returndata length:",eturndata.length;
        //console.logBytes(returndata);
        //console.log(abi.decode(returndata, (bool)));
        //console.logBytes32(returndata);
/**
    mapping (address => bool) public minters;
    function addMinter(address _minter) public {
        require(msg.sender == governance, "!governance");
        minters[_minter] = true;
    }

    function removeMinter(address _minter) public {
        require(msg.sender == governance, "!governance");
        minters[_minter] = false;
    }

 */

/**
 * MIT License
 * ===========
 *
 * Copyright (c) 2020, 2021 Aries Financial
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */
