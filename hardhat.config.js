/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
  },
  contracts: {
    BUSDHandler: { // Check if this matches the actual contract name
      path: "./contracts/BUSDHandler.sol", // Check if this path is correct
    },
  },
},
};
