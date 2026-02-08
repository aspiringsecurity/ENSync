'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { WalletInfo } from '@/components/WalletInfo';
import { TransactionHistory } from '@/components/TransactionHistory';
import { HomePage } from '@/components/HomePage';
import { Dashboard } from '@/components/Dashboard';
import { ENSProfileFull } from '@/components/ENSProfileFull';
import { ENSStatusUpdate } from '@/components/ENSStatusUpdate';
import { ENSMultiRecords } from '@/components/ENSMultiRecords';
import { ENSAvatarManager } from '@/components/ENSAvatarManager';
import { IPFSDeployment } from '@/components/IPFSDeployment';
import { ENSContentHash } from '@/components/ENSContentHash';
import { ENSPrimaryName } from '@/components/ENSPrimaryName';
import { ENSTransfer } from '@/components/ENSTransfer';
import { ENSLookup } from '@/components/ENSLookup';
import { AllMyENSNames } from '@/components/AllMyENSNames';
import { ENSProvider } from '@/components/ENSContext';
import ENSRegistration from '@/components/ENSRegistration';

type Tab = 'home' | 'dashboard' | 'lookup' | 'register' | 'profile' | 'edit' | 'advanced';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  return (
    <ENSProvider>
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Left Sidebar - Navigation & Chains */}
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          {/* Top Bar */}
          <TopBar />

          {/* Content + Right Sidebar */}
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
              {activeTab === 'home' && <HomePage />}
              
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}

              {activeTab === 'lookup' && (
                <div className="max-w-4xl mx-auto">
                  <ENSLookup />
                </div>
              )}

              {activeTab === 'register' && (
                <div className="max-w-3xl mx-auto">
                  <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <h2 className="text-2xl font-bold mb-2">🎯 Register Your ENS Name</h2>
                    <p className="text-gray-400 mb-4">
                      Register a new .eth name on Sepolia testnet. The process takes about 60 seconds.
                    </p>
                    <div className="bg-blue-900/20 border border-blue-500 rounded p-3">
                      <p className="text-blue-300 text-sm">
                        💡 <strong>Note:</strong> Registration uses a 2-step commit-reveal process to prevent front-running.
                      </p>
                    </div>
                  </div>
                  <ENSRegistration />
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-6xl mx-auto">
                  <ENSProfileFull />
                </div>
              )}

              {activeTab === 'edit' && (
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ENSStatusUpdate />
                    <ENSMultiRecords />
                    <ENSAvatarManager />
                    <IPFSDeployment />
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="max-w-6xl mx-auto">
                  <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
                    <p className="text-yellow-300 text-sm">
                      ⚠️ <strong>Warning:</strong> These are advanced features. Some actions like ENS transfer are irreversible.
                    </p>
                  </div>

                  {/* All ENS Names - Automatic Detection */}
                  <div className="mb-6">
                    <AllMyENSNames />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ENSPrimaryName />
                    <ENSContentHash />
                    <ENSTransfer />
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Wallet & Transactions */}
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-4 space-y-4 overflow-y-auto">
              <WalletInfo />
              <TransactionHistory />
            </div>
          </div>
        </div>
      </div>
    </ENSProvider>
  );
}
