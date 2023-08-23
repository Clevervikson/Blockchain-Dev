import React, { useState } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import SimpleStorage from './artifacts/contracts/SimpleStorage.sol/SimpleStorage.json'

const BUSDPortal = () => {
  const [web3Provider, setWeb3Provider] = useState(null);
  const [ethereumAddress, setEthereumAddress] = useState('');
  const BUSDContractAddress = '0x...'; // Replace this with the actual BUSD contract address

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const provider = await web3Modal.connect();
    setWeb3Provider(provider);
  };

  const sendBUSD = async () => {
    if (!web3Provider) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!ethereumAddress) {
      alert('Please enter a valid Ethereum address.');
      return;
    }

    try {
      const signer = new ethers.providers.Web3Provider(web3Provider).getSigner();
      const contract = new ethers.Contract(BUSDContractAddress, ABI, signer);

      // Perform BUSD transfer logic here
      // Example: await contract.transfer(ethereumAddress, amount);

      alert('BUSD sent successfully!');
    } catch (error) {
      alert('Error sending BUSD: ' + error.message);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Connect Wallet</button>
      <input
        type="text"
        value={ethereumAddress}
        onChange={(e) => setEthereumAddress(e.target.value)}
        placeholder="Enter Ethereum address"
      />
      <button onClick={sendBUSD}>Send BUSD</button>
    </div>
  );
};

export default BUSDPortal;
