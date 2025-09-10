import React from 'react';
import { FaWallet, FaSignOutAlt } from 'react-icons/fa';
import { useWallet } from '../hooks/useWallet';

const WalletConnect = () => {
  const { isConnected, account, isLoading, connectWallet, disconnectWallet } = useWallet();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-3">
        <div className="glass rounded-lg px-4 py-2 flex items-center gap-2 text-gray-300 border border-gray-700">
          <FaWallet className="text-gray-400" />
          <span className="font-medium">{formatAddress(account)}</span>
        </div>
        <button
          onClick={disconnectWallet}
          className="glass hover:bg-red-500/10 transition-all duration-300 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-300 hover:text-red-400 border border-gray-700 hover:border-red-500/50"
        >
          <FaSignOutAlt />
          <span>Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-lg px-6 py-3 flex items-center gap-2 text-gray-200 font-medium shadow-lg hover:shadow-xl border border-gray-600 hover:border-gray-500"
    >
      <FaWallet />
      <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
};

export default WalletConnect;
