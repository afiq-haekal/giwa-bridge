import React, { useState, useEffect } from 'react';
import { formatEther, parseEther } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';
import { FaArrowDown, FaSpinner, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const DepositETH = ({ clients, account, onSwitchToSepolia }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  // Get L1 balance
  useEffect(() => {
    if (clients?.publicClientL1 && account) {
      getBalance();
    }
  }, [clients, account]);

  const getBalance = async () => {
    try {
      const l1Balance = await clients.publicClientL1.getBalance({ 
        address: account 
      });
      setBalance(formatEther(l1Balance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!clients) {
      setError('Wallet not connected properly');
      return;
    }

    setIsLoading(true);
    setStatus('Preparing deposit...');
    setError('');
    setTxHash('');

    try {
      // Step 0: Switch to Ethereum Sepolia network
      setStatus('Switching to Ethereum Sepolia network...');
      if (onSwitchToSepolia) {
        await onSwitchToSepolia();
      }

      // Build deposit parameters
      setStatus('Building deposit transaction...');
      const depositArgs = await clients.publicClientL2.buildDepositTransaction({
        mint: parseEther(amount),
        to: account,
      });

      // Send deposit transaction on L1
      setStatus('Sending deposit transaction on Ethereum...');
      const depositHash = await clients.walletClientL1.depositTransaction({
        ...depositArgs,
        account: account, // Pass account explicitly for viem v2
      });
      setTxHash(depositHash);
      
      setStatus('Waiting for L1 confirmation...');
      const depositReceipt = await clients.publicClientL1.waitForTransactionReceipt({ 
        hash: depositHash 
      });

      // Get L2 transaction hash
      const [l2Hash] = getL2TransactionHashes(depositReceipt);
      
      setStatus('Waiting for L2 confirmation (1-3 minutes)...');
      await clients.publicClientL2.waitForTransactionReceipt({
        hash: l2Hash,
      });

      setStatus('✅ Deposit completed successfully!');
      setAmount('');
      getBalance(); // Refresh balance
      
    } catch (error) {
      console.error('Deposit error:', error);
      setError(error.message || 'Deposit failed');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Deposit ETH</h3>
        <p className="text-gray-300">Ethereum → GIWA</p>
        <div className="flex items-center justify-center mt-4">
          <div className="bg-blue-500/20 rounded-full p-3">
            <FaArrowDown className="text-blue-400 text-xl" />
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4 p-3 glass-dark rounded-lg">
        <p className="text-gray-400 text-sm">Ethereum Sepolia Balance:</p>
        <p className="text-white text-lg font-medium">{parseFloat(balance).toFixed(6)} ETH</p>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Amount to deposit
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <span className="absolute right-3 top-3 text-gray-400">ETH</span>
        </div>
        <div className="flex gap-2 mt-2">
          {['0.001', '0.01', '0.1'].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className="text-xs bg-white/10 hover:bg-white/20 transition-colors rounded px-2 py-1 text-gray-300"
              disabled={isLoading}
            >
              {val} ETH
            </button>
          ))}
        </div>
      </div>

      {/* Switch Network Button */}
      <button
        onClick={onSwitchToSepolia}
        className="w-full mb-4 bg-yellow-500/20 hover:bg-yellow-500/30 transition-colors rounded-lg px-4 py-2 text-yellow-300 text-sm"
      >
        🔄 Switch to Ethereum Sepolia
      </button>

      {/* Deposit Button */}
      <button
        onClick={handleDeposit}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-lg px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>Deposit ETH</span>
        )}
      </button>

      {/* Status */}
      {status && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
          status.includes('✅') 
            ? 'bg-green-500/20 text-green-300' 
            : 'bg-blue-500/20 text-blue-300'
        }`}>
          {status.includes('✅') ? (
            <FaCheckCircle />
          ) : (
            <FaSpinner className="animate-spin" />
          )}
          <span className="text-sm">{status}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 text-red-300 rounded-lg flex items-center gap-2">
          <FaExclamationCircle />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Transaction Hash */}
      {txHash && (
        <div className="mt-4 p-3 glass-dark rounded-lg">
          <p className="text-gray-400 text-xs mb-1">Transaction Hash:</p>
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-xs break-all underline"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default DepositETH;
