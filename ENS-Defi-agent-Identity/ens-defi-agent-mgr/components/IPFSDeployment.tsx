'use client';

import { useState } from 'react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, useEnsResolver } from 'wagmi';
import { useENS } from './ENSContext';
import { sepolia } from 'wagmi/chains';
import { ENS_PUBLIC_RESOLVER_ABI, getNamehash } from '@/lib/ens';

export function IPFSDeployment() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { selectedName } = useENS();
  const [ipfsHash, setIpfsHash] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedHash, setUploadedHash] = useState('');

  const { data: resolver } = useEnsResolver({
    name: selectedName || undefined,
    chainId: sepolia.id,
  });

  const { data: hash, writeContract, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // For demo purposes - in production, use a proper IPFS service
      // Options: Pinata, Web3.Storage, NFT.Storage, Infura IPFS
      
      // Simulated upload - replace with actual IPFS upload
      alert('For production, integrate with Pinata, Web3.Storage, or NFT.Storage API.\n\nFor now, please enter your IPFS hash manually after uploading to an IPFS service.');
      
      setUploading(false);
    } catch (error) {
      console.error('IPFS upload error:', error);
      alert('Upload failed. Please enter IPFS hash manually.');
      setUploading(false);
    }
  };

  const setContentHash = () => {
    if (!selectedName || !ipfsHash || !resolver) return;

    // Convert IPFS hash to content hash bytes
    // For ENS content hash, we need to encode it properly
    // Using a simple hex encoding for the IPFS URL
    
    let contentHashBytes: `0x${string}`;
    
    try {
      // Simple encoding: just convert the ipfs:// URL to hex
      const ipfsUrl = `ipfs://${ipfsHash}`;
      const hexString = Array.from(ipfsUrl)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('');
      contentHashBytes = `0x${hexString}` as `0x${string}`;

      writeContract({
        address: resolver,
        abi: ENS_PUBLIC_RESOLVER_ABI,
        functionName: 'setContenthash',
        args: [getNamehash(selectedName), contentHashBytes],
      });
    } catch (error) {
      console.error('Error setting content hash:', error);
      alert('Error setting content hash. Please check the IPFS hash format.');
    }
  };

  if (!isConnected || chainId !== sepolia.id || !selectedName || !resolver) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400 text-sm">
          {!isConnected ? 'Connect wallet to deploy to IPFS' : 
           chainId !== sepolia.id ? 'Switch to Sepolia network' :
           !selectedName ? 'Select an ENS name' : 'Loading...'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">🚀 IPFS Deployment</h2>
      
      <div className="space-y-4">
        <div className="bg-blue-900/20 border border-blue-500 rounded p-3 text-sm text-blue-300">
          💡 Deploy your website to IPFS and link it to <strong>{selectedName}</strong>
        </div>

        {/* File Upload Info */}
        <div className="bg-gray-700 rounded p-4">
          <p className="font-semibold mb-2 text-sm">📤 Upload to IPFS:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs text-gray-300">
            <li>Use <a href="https://www.pinata.cloud/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Pinata</a>, <a href="https://web3.storage/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Web3.Storage</a>, or <a href="https://nft.storage/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">NFT.Storage</a></li>
            <li>Upload your website files/folder</li>
            <li>Copy the IPFS hash (CID)</li>
            <li>Paste it below and set content hash</li>
          </ol>
        </div>

        {/* Manual IPFS Hash Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            IPFS Hash (CID)
          </label>
          <input
            type="text"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
            placeholder="QmXxxx... or bafyxxx..."
            className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Example: QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG
          </p>
        </div>

        {ipfsHash && (
          <div className="bg-gray-700 rounded p-3">
            <p className="text-xs text-gray-400 mb-1">Preview:</p>
            <a
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm break-all"
            >
              https://ipfs.io/ipfs/{ipfsHash} →
            </a>
          </div>
        )}

        {/* Set Content Hash */}
        <button
          onClick={setContentHash}
          disabled={!ipfsHash || isPending || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition"
        >
          {isPending ? 'Waiting for approval...' : isConfirming ? 'Confirming...' : 'Set Content Hash on ENS'}
        </button>

        {isSuccess && (
          <div className="bg-green-900/20 border border-green-500 rounded p-3">
            <p className="text-green-400 text-sm font-semibold mb-2">
              ✅ Content hash set successfully!
            </p>
            <p className="text-green-300 text-xs mb-2">
              Your site is now accessible at:
            </p>
            <div className="space-y-1">
              <a
                href={`https://${selectedName}.limo`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm block"
              >
                🔗 https://{selectedName}.limo
              </a>
              <a
                href={`https://${selectedName}.eth.link`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm block"
              >
                🔗 https://{selectedName}.eth.link
              </a>
            </div>
          </div>
        )}

        <div className="bg-gray-700 rounded p-3 text-xs text-gray-300">
          <p className="font-semibold mb-2">📚 How it works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Upload your website files to IPFS using a service</li>
            <li>Get the IPFS hash (CID) from the upload</li>
            <li>Paste the hash above and click "Set Content Hash"</li>
            <li>Access your site at {selectedName}.limo or {selectedName}.eth.link</li>
          </ol>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3 text-xs text-yellow-300">
          ⚠️ <strong>Note:</strong> Make sure your IPFS content is pinned to remain accessible. Use pinning services like Pinata or Web3.Storage for permanent hosting.
        </div>
      </div>
    </div>
  );
}
