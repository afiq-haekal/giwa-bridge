import React, { useState, useEffect } from 'react';
import { formatEther, parseEther } from 'viem';
import { FaArrowUp, FaSpinner, FaCheckCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';

const WithdrawETH = ({ clients, account, onSwitchToGiwa }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState('0');
  const [status, setStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Initiate withdrawal on GIWA',
    'Wait for dispute game (up to 2 hours)',
    'Prove withdrawal on Ethereum', 
    'Wait for challenge period (~7 days)',
    'Finalize withdrawal on Ethereum'
  ];

  // Get L2 balance
  useEffect(() => {
    if (clients?.publicClientL2 && account) {
      getBalance();
    }
  }, [clients, account]);

  const getBalance = async () => {
    try {
      const l2Balance = await clients.publicClientL2.getBalance({ 
        address: account 
      });
      setBalance(formatEther(l2Balance));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!clients) {
      setError('Wallet not connected properly');
      return;
    }

    setIsLoading(true);
    setStatus('Preparing withdrawal...');
    setError('');
    setTxHash('');
    setCurrentStep(0);

    try {
      // Step 1: Build withdrawal parameters
      setStatus('Building withdrawal transaction...');
      setCurrentStep(1);
      const withdrawalArgs = await clients.publicClientL1.buildInitiateWithdrawal({
        to: account,
        value: parseEther(amount),
      });

      // Step 2: Initiate withdrawal on L2
      setStatus('Initiating withdrawal on GIWA...');
      const withdrawalHash = await clients.walletClientL2.initiateWithdrawal(withdrawalArgs);
      setTxHash(withdrawalHash);
      
      setStatus('Waiting for L2 confirmation...');
      const withdrawalReceipt = await clients.publicClientL2.waitForTransactionReceipt({ 
        hash: withdrawalHash 
      });

      // Step 3: Wait to prove (can take up to 2 hours)
      setStatus('⏳ Waiting for dispute game (up to 2 hours)...');
      setCurrentStep(2);
      
      const { output, withdrawal } = await clients.publicClientL1.waitToProve({
        receipt: withdrawalReceipt,
        targetChain: clients.walletClientL2.chain
      });

      // Step 4: Prove withdrawal
      setStatus('Proving withdrawal on Ethereum...');
      setCurrentStep(3);
      
      const proveArgs = await clients.publicClientL2.buildProveWithdrawal({
        output,
        withdrawal,
      });

      const proveHash = await clients.walletClientL1.proveWithdrawal(proveArgs);
      
      await clients.publicClientL1.waitForTransactionReceipt({ hash: proveHash });

      // Step 5: Wait for challenge period
      setStatus('⏰ Challenge period started (~7 days). You can finalize after this period.');
      setCurrentStep(4);
      
      // Note: In a real app, you'd probably store this state and allow users to come back later
      // For demo purposes, we'll just show the status
      
      setStatus('✅ Withdrawal initiated! Return in ~7 days to finalize.');
      setAmount('');
      getBalance();
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      setError(error.message || 'Withdrawal failed');
      setStatus('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Withdraw ETH</h3>
        <p className="text-gray-300">GIWA → Ethereum</p>
        <div className="flex items-center justify-center mt-4">
          <div className="bg-red-500/20 rounded-full p-3">
            <FaArrowUp className="text-red-400 text-xl" />
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4 p-3 glass-dark rounded-lg">
        <p className="text-gray-400 text-sm">GIWA Sepolia Balance:</p>
        <p className="text-white text-lg font-medium">{parseFloat(balance).toFixed(6)} ETH</p>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm font-medium mb-2">
          Amount to withdraw
        </label>
        <div className="relative">
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00005"
            className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-red-400 focus:outline-none transition-colors"
            disabled={isLoading}
          />
          <span className="absolute right-3 top-3 text-gray-400">ETH</span>
        </div>
        <div className="flex gap-2 mt-2">
          {['0.00005', '0.001', '0.01'].map((val) => (
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
        onClick={onSwitchToGiwa}
        className="w-full mb-4 bg-purple-500/20 hover:bg-purple-500/30 transition-colors rounded-lg px-4 py-2 text-purple-300 text-sm"
      >
        🔄 Switch to GIWA Sepolia
      </button>

      {/* Withdrawal Steps */}
      {isLoading && (
        <div className="mb-4 p-3 glass-dark rounded-lg">
          <p className="text-gray-300 text-sm mb-2">Withdrawal Progress:</p>
          {steps.map((step, index) => (
            <div key={index} className={`flex items-center gap-2 text-xs mb-1 ${
              index < currentStep ? 'text-green-400' : 
              index === currentStep ? 'text-blue-400' : 'text-gray-500'
            }`}>
              {index < currentStep ? (
                <FaCheckCircle />
              ) : index === currentStep ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaClock />
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Warning */}
      <div className="mb-4 p-3 bg-yellow-500/20 text-yellow-300 rounded-lg">
        <p className="text-xs">
          ⚠️ Withdrawals take ~7 days due to the challenge period. This is normal for optimistic rollups.
        </p>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={handleWithdraw}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-lg px-6 py-3 text-white font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <span>Withdraw ETH</span>
        )}
      </button>

      {/* Status */}
      {status && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
          status.includes('✅') 
            ? 'bg-green-500/20 text-green-300' 
            : status.includes('⏳') || status.includes('⏰')
            ? 'bg-yellow-500/20 text-yellow-300'
            : 'bg-blue-500/20 text-blue-300'
        }`}>
          {status.includes('✅') ? (
            <FaCheckCircle />
          ) : status.includes('⏳') || status.includes('⏰') ? (
            <FaClock />
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
            href={`https://sepolia-explorer.giwa.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-xs break-all underline"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
};

export default WithdrawETH;
