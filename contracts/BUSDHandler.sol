// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    // Add other necessary ERC-20 functions here if required
}

contract BUSDHandler {
    address public owner;
    address public busdToken;

    event Transfer(address indexed recipient, uint256 amount);

    constructor(address _busdToken) {
        owner = msg.sender;
        busdToken = _busdToken;
    }

    function forwardBUSD(address recipient, uint256 amount) external {
        require(msg.sender == owner, "You are not the owner");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than zero");

        require(
            IERC20(busdToken).transfer(recipient, amount),
            "BUSD transfer failed"
        );

        emit Transfer(recipient, amount);
    }

    // Function to receive BUSD tokens
    // This function is required to be able to receive BUSD tokens in this contract
    function receiveBUSD(uint256 /*amount*/) external view {
        require(msg.sender == busdToken, "Only BUSD token contract can call this");
        // Do any additional handling if needed
    }
}
