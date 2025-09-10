import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { publicActionsL1, publicActionsL2, walletActionsL1, walletActionsL2 } from 'viem/op-stack';
import { sepolia, giwaSepolia } from '../config/chains';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState(null);

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          setupClients(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const setupClients = useCallback(async (currentAccount) => {
    if (!currentAccount) return;

    try {
      console.log('Setting up clients for account:', currentAccount);

      // Public client for Ethereum Sepolia (reading data)
      const pubClientL1 = createPublicClient({
        chain: sepolia,
        transport: http(), // Default RPC sesuai docs GIWA
      }).extend(publicActionsL1());

      // Wallet client for Ethereum Sepolia (sending transactions)
      // Create wallet client dengan MetaMask transport dan account
      const walletClientL1 = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      }).extend(walletActionsL1());

      // Public client for GIWA Sepolia (reading data)
      const pubClientL2 = createPublicClient({
        chain: giwaSepolia,
        transport: http(), // Default RPC sesuai docs GIWA
      }).extend(publicActionsL2());

      // Wallet client for GIWA Sepolia (sending transactions)
      const walletClientL2 = createWalletClient({
        chain: giwaSepolia,
        transport: custom(window.ethereum),
      }).extend(walletActionsL2());

      setClients({
        publicClientL1: pubClientL1,
        walletClientL1: walletClientL1,
        publicClientL2: pubClientL2,
        walletClientL2: walletClientL2,
      });

      console.log('Clients setup completed');
    } catch (error) {
      console.error('Error setting up clients:', error);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this app!');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Connecting wallet...');
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      console.log('Accounts:', accounts);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        setupClients(accounts[0]);
        console.log('Wallet connected successfully:', accounts[0]);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setClients(null);
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia.infura.io/v3/'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/'],
          }],
        });
      }
    }
  };

  const switchToGiwa = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1643e' }], // GIWA Sepolia chain ID (91342 in hex)
      });
    } catch (error) {
      if (error.code === 4902) {
        // Chain not added to MetaMask
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x1643e',
            chainName: 'Giwa Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://sepolia-rpc.giwa.io'],
            blockExplorerUrls: ['https://sepolia-explorer.giwa.io'],
          }],
        });
      }
    }
  };

  return {
    account,
    isConnected,
    isLoading,
    clients,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
    switchToGiwa,
  };
};
