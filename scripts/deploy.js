// deploy.js
async function main() {
    // Deploy the BUSDHandler contract
    const BUSDHandler = await ethers.getContractFactory("BUSDHandler");
    const busdTokenAddress = "<INSERT_BUSD_TOKEN_ADDRESS>"; // Replace with the actual address of the BUSD token
    const busdHandler = await BUSDHandler.deploy(busdTokenAddress);
    await busdHandler.deployed();
  
    console.log("BUSDHandler deployed to:", busdHandler.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  