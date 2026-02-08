'use client';

import { useState } from 'react';
import { useAccount, useEnsName, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { ENS_REVERSE_REGISTRAR_ABI } from '@/lib/ens';

const REVERSE_REGISTRAR_ADDRESS = '0x084b1c3C81545d370f3634392De611CaaBFf8148'; // Sepolia

export function ENSPrimaryName() {
  const [error, setError] = useState('');
  const [manualName, setManualName] = useState('');
  const [useManual, setUseManual] = useState(false);
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: detectedEnsName, isLoading: ensLoading, error: ensError } = useEnsName({
    address,
    chainId: sepolia.id,
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Log everything
  console.log('⭐ PRIMARY NAME COMPONENT');
  console.log('  - Connected:', isConnected);
  console.log('  - Address:', address);
  console.log('  - Chain ID:', chainId);
  console.log('  - Detected ENS Name:', detectedEnsName);
  console.log('  - ENS Loading:', ensLoading);
  console.log('  - ENS Error:', ensError);
  console.log('  - Manual Name:', manualName);
  console.log('  - Use Manual:', useManual);
  console.log('  - Transaction Hash:', hash);
  console.log('  - Is Success:', isSuccess);

  const ensNameToSet = useManual ? (manualName.endsWith('.eth') ? manualName : `${manualName}.eth`) : detectedEnsName;
  const canSet = isConnected && chainId === sepolia.id && ensNameToSet;

  const handleSetPrimary = async () => {
    if (!canSet || !ensNameToSet) return;
    
    setError('');
    
    console.log('🔥 SETTING PRIMARY NAME');
    console.log('  - ENS Name to set:', ensNameToSet);
    console.log('  - Your address:', address);
    console.log('  - Reverse Registrar:', REVERSE_REGISTRAR_ADDRESS);
    console.log('  - Chain ID:', chainId);
    
    try {
      const result = writeContract({
        address: REVERSE_REGISTRAR_ADDRESS,
        abi: ENS_REVERSE_REGISTRAR_ABI,
        functionName: 'setName',
        args: [ensNameToSet],
      });
      
      console.log('  - Write contract result:', result);
    } catch (err) {
      console.error('  - Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to set primary name');
    }
  };

  if (!isConnected || chainId !== sepolia.id) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400 text-sm">
          {!isConnected ? 'Connect wallet to set primary name' : 'Switch to Sepolia network'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">⭐ Set Primary ENS Name</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-900/20 border border-blue-500 rounded p-3">
          <p className="text-blue-300 text-sm">
            Your primary name will appear when apps look up your address
          </p>
        </div>

        {!detectedEnsName && (
          <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3">
            <p className="text-yellow-300 text-sm">
              ⚠️ No primary name detected. Enter your ENS name manually below.
            </p>
          </div>
        )}

        {detectedEnsName && !useManual ? (
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Current Primary Name:</p>
            <p className="text-lg font-semibold text-blue-400">{detectedEnsName}</p>
            <button
              onClick={() => setUseManual(true)}
              className="text-xs text-gray-400 hover:text-white mt-2 underline"
            >
              Change to different name
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium mb-2">
              ENS Name {detectedEnsName && '(Change)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value.toLowerCase())}
                placeholder="myname"
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <span className="flex items-center px-3 bg-gray-700 rounded text-gray-300">.eth</span>
            </div>
            {detectedEnsName && (
              <button
                onClick={() => {
                  setUseManual(false);
                  setManualName('');
                }}
                className="text-xs text-gray-400 hover:text-white mt-2 underline"
              >
                Use detected name instead
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleSetPrimary}
          disabled={!canSet || isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Setting...' : `Set ${ensNameToSet || 'ENS'} as Primary`}
        </button>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm font-semibold">✅ Primary name set successfully!</p>
            <p className="text-xs text-gray-400 mt-1">Your address will now resolve to {ensNameToSet}</p>
            <p className="text-xs text-blue-300 mt-2">
              💡 Go back to Dashboard and click "🔄 Refresh" to see your new primary name
            </p>
          </div>
        )}

        {(error || writeError) && (
          <div className="bg-red-900/20 border border-red-500 rounded p-3">
            <p className="text-red-400 text-sm">❌ {error || writeError?.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
