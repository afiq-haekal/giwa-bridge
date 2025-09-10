import React, { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import WalletConnect from './components/WalletConnect';
import DepositETH from './components/DepositETH';
import WithdrawETH from './components/WithdrawETH';

function App() {
  const { isConnected, account, clients, switchToSepolia, switchToGiwa } = useWallet();
  const [activeTab, setActiveTab] = useState('deposit');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="relative z-10 border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg border border-gray-600">
                <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-200">GIWA Bridge</h1>
                <p className="text-gray-500 text-sm">Bridge ETH between Ethereum & GIWA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="https://docs.giwa.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-all duration-300 text-gray-400 hover:text-gray-300 border border-gray-700"
              >
                <span className="font-medium">Docs</span>
              </a>
              
              <WalletConnect />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-800/60 border border-gray-700 mb-8">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-400">Sepolia Testnet</span>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 text-gray-200">Bridge Your ETH</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Seamlessly transfer ETH between Ethereum Sepolia and GIWA Sepolia networks
            </p>
          </div>

          {isConnected ? (
            <div className="space-y-8">
              {/* Tab Navigation */}
              <div className="flex justify-center">
                <div className="bg-gray-800/60 border border-gray-700 rounded-3xl p-1.5 flex gap-1 shadow-2xl">
                  <button
                    onClick={() => setActiveTab('deposit')}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      activeTab === 'deposit'
                        ? 'bg-gray-600 text-gray-200 shadow-lg border border-gray-600'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    ↓ Deposit to GIWA
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('withdraw')}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                      activeTab === 'withdraw'
                        ? 'bg-gray-600 text-gray-200 shadow-lg border border-gray-600'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
                    }`}
                  >
                    ↑ Withdraw to Ethereum
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="relative">
                <div className="bg-gray-800/60 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden">
                  {activeTab === 'deposit' ? (
                    <DepositETH 
                      clients={clients} 
                      account={account} 
                      onSwitchToSepolia={switchToSepolia} 
                    />
                  ) : (
                    <WithdrawETH 
                      clients={clients} 
                      account={account} 
                      onSwitchToGiwa={switchToGiwa} 
                    />
                  )}
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                {/* Deposit Information */}
                <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">ETH Deposit Process</h3>
                  <p className="text-gray-400 text-sm mb-6">How to bridge ETH from Ethereum to GIWA</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      <div>
                        <h4 className="text-gray-300 font-medium">Send Transaction on Ethereum</h4>
                        <p className="text-gray-500 text-sm">Your ETH is sent to the OptimismPortal contract</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      <div>
                        <h4 className="text-gray-300 font-medium">Automatic L2 Transaction</h4>
                        <p className="text-gray-500 text-sm">GIWA sequencer creates corresponding transaction</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                      <div>
                        <h4 className="text-gray-300 font-medium">Deposit Complete</h4>
                        <p className="text-gray-500 text-sm">ETH appears in your GIWA wallet (1-3 minutes)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">
                      <strong>Time:</strong> 1-3 minutes<br/>
                      <strong>Process:</strong> Lock-and-Mint<br/>
                      <strong>Security:</strong> Immediate finality
                    </p>
                  </div>
                </div>
                
                {/* Withdraw Information */}
                <div className="bg-gray-800/40 border border-gray-700 rounded-2xl p-8">
                  <h3 className="text-xl font-semibold text-gray-200 mb-4">ETH Withdrawal Process</h3>
                  <p className="text-gray-400 text-sm mb-6">How to bridge ETH from GIWA to Ethereum</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      <div>
                        <h4 className="text-gray-300 font-medium">Initiate Withdrawal</h4>
                        <p className="text-gray-500 text-sm">Send withdrawal transaction on GIWA</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      <div>
                        <h4 className="text-gray-300 font-medium">Prove Withdrawal</h4>
                        <p className="text-gray-500 text-sm">Submit proof after dispute game (up to 2 hours)</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                      <div>
                        <h4 className="text-gray-300 font-medium">Finalize Withdrawal</h4>
                        <p className="text-gray-500 text-sm">Complete after 7-day challenge period</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-600">
                    <p className="text-gray-400 text-sm">
                      <strong>Time:</strong> ~7 days total<br/>
                      <strong>Process:</strong> Burn-and-Unlock<br/>
                      <strong>Security:</strong> Challenge period protection
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-gray-800/60 border border-gray-700 rounded-3xl p-12 max-w-md mx-auto shadow-2xl">
                <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.19 14,4.29 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-200 mb-4">Connect Your Wallet</h3>
                <p className="text-gray-400 mb-8">
                  Connect your MetaMask wallet to start bridging ETH between networks
                </p>
                <WalletConnect />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
