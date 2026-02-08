'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId, useReadContract, usePublicClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { keccak256, encodePacked } from 'viem';

// ETH Registrar Controller on Sepolia
const ETH_REGISTRAR_CONTROLLER = '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72';
const PUBLIC_RESOLVER = '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD';
const SECONDS_PER_YEAR = 31536000;

const REGISTRAR_ABI = [
  {
    inputs: [{ name: 'name', type: 'string' }],
    name: 'available',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'commitment', type: 'bytes32' }],
    name: 'commit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'duration', type: 'uint256' },
      { name: 'secret', type: 'bytes32' },
      { name: 'resolver', type: 'address' },
      { name: 'data', type: 'bytes[]' },
      { name: 'reverseRecord', type: 'bool' },
      { name: 'ownerControlledFuses', type: 'uint16' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'duration', type: 'uint256' },
      { name: 'secret', type: 'bytes32' },
      { name: 'resolver', type: 'address' },
      { name: 'data', type: 'bytes[]' },
      { name: 'reverseRecord', type: 'bool' },
      { name: 'ownerControlledFuses', type: 'uint16' },
    ],
    name: 'makeCommitment',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'duration', type: 'uint256' },
    ],
    name: 'rentPrice',
    outputs: [
      {
        components: [
          { name: 'base', type: 'uint256' },
          { name: 'premium', type: 'uint256' },
        ],
        name: 'price',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

type Step = 'input' | 'commit' | 'wait' | 'register' | 'complete';

export default function ENSRegistration() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const [name, setName] = useState('');
  const [years, setYears] = useState(1);
  const [step, setStep] = useState<Step>('input');
  const [secret, setSecret] = useState<`0x${string}`>();
  const [commitment, setCommitment] = useState<`0x${string}`>();
  const [waitTime, setWaitTime] = useState(60);
  const [error, setError] = useState('');

  // Check if name is available
  const { data: available, refetch: checkAvailability } = useReadContract({
    address: ETH_REGISTRAR_CONTROLLER,
    abi: REGISTRAR_ABI,
    functionName: 'available',
    args: name ? [name] : undefined,
    chainId: sepolia.id,
  });

  // Get registration price
  const { data: priceData } = useReadContract({
    address: ETH_REGISTRAR_CONTROLLER,
    abi: REGISTRAR_ABI,
    functionName: 'rentPrice',
    args: name ? [name, BigInt(years * SECONDS_PER_YEAR)] : undefined,
    chainId: sepolia.id,
  });

  const { writeContract, data: hash, isPending, reset } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Generate random secret
  const generateSecret = (): `0x${string}` => {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}`;
  };

  // Validate name
  const validateName = () => {
    if (!name.trim()) {
      setError('Please enter an ENS name');
      return false;
    }
    if (!/^[a-z0-9-]+$/.test(name)) {
      setError('Name can only contain lowercase letters, numbers, and hyphens');
      return false;
    }
    if (name.length < 3) {
      setError('Name must be at least 3 characters');
      return false;
    }
    setError('');
    return true;
  };

  // Check availability
  const handleCheckAvailability = async () => {
    if (!validateName()) return;
    await checkAvailability();
  };

  // Start commit phase
  const handleStartCommit = async () => {
    if (!address || !publicClient || !validateName()) return;

    try {
      setError('');
      const newSecret = generateSecret();
      setSecret(newSecret);

      // Make commitment hash
      const commitmentHash = await publicClient.readContract({
        address: ETH_REGISTRAR_CONTROLLER,
        abi: REGISTRAR_ABI,
        functionName: 'makeCommitment',
        args: [
          name,
          address,
          BigInt(years * SECONDS_PER_YEAR),
          newSecret,
          PUBLIC_RESOLVER,
          [],
          true,
          0,
        ],
      });

      setCommitment(commitmentHash);
      setStep('commit');

      // Send commit transaction
      writeContract({
        address: ETH_REGISTRAR_CONTROLLER,
        abi: REGISTRAR_ABI,
        functionName: 'commit',
        args: [commitmentHash],
      });
    } catch (err: any) {
      setError(err.message || 'Failed to start commitment');
      setStep('input');
    }
  };

  // Complete registration
  const handleRegister = async () => {
    if (!secret || !priceData || !address) return;

    try {
      setError('');
      setStep('register');
      reset();

      const totalPrice = (priceData as any).base + (priceData as any).premium;
      const priceWithBuffer = (totalPrice * BigInt(110)) / BigInt(100); // 10% buffer

      console.log('🚀 REGISTERING ENS NAME');
      console.log('  - Name:', name);
      console.log('  - Owner (your address):', address);
      console.log('  - Duration:', years, 'years');
      console.log('  - Secret:', secret);
      console.log('  - Resolver:', PUBLIC_RESOLVER);
      console.log('  - Reverse Record:', true);
      console.log('  - Price:', totalPrice.toString());
      console.log('  - Price with buffer:', priceWithBuffer.toString());

      writeContract({
        address: ETH_REGISTRAR_CONTROLLER,
        abi: REGISTRAR_ABI,
        functionName: 'register',
        args: [
          name,
          address,
          BigInt(years * SECONDS_PER_YEAR),
          secret,
          PUBLIC_RESOLVER,
          [],
          true,
          0,
        ],
        value: priceWithBuffer,
      });
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Failed to register');
      setStep('wait');
    }
  };

  // Handle transaction success and timer
  useEffect(() => {
    if (isSuccess && step === 'commit') {
      console.log('✅ Commit successful, starting wait period');
      setStep('wait');
      setWaitTime(60);
    }

    if (isSuccess && step === 'register') {
      console.log('✅ Registration successful!');
      console.log('  - Transaction hash:', hash);
      console.log('  - ENS Name:', `${name}.eth`);
      console.log('  - Owner:', address);
      setStep('complete');
    }
  }, [isSuccess, step, hash, name, address]);

  // Separate effect for countdown timer
  useEffect(() => {
    if (step === 'wait' && waitTime > 0) {
      const interval = setInterval(() => {
        setWaitTime(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [step, waitTime]);

  // Reset function
  const handleReset = () => {
    setStep('input');
    setName('');
    setYears(1);
    setSecret(undefined);
    setCommitment(undefined);
    setWaitTime(60);
    setError('');
    reset();
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🔌</div>
        <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400">Please connect your wallet to register an ENS name</p>
      </div>
    );
  }

  if (chainId !== sepolia.id) {
    return (
      <div className="bg-red-900/20 border border-red-500 rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold mb-2 text-red-400">Wrong Network</h3>
        <p className="text-red-300">Please switch to Sepolia network to register ENS names</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {['Check', 'Commit', 'Wait', 'Register'].map((label, index) => {
          const stepIndex = ['input', 'commit', 'wait', 'register', 'complete'].indexOf(step);
          const isActive = index <= stepIndex;
          const isCurrent = index === stepIndex;
          
          return (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    isActive
                      ? isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-600/30'
                        : 'bg-green-600 text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {isActive && !isCurrent ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-2 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </span>
              </div>
              {index < 3 && (
                <div
                  className={`h-1 flex-1 mx-2 rounded transition ${
                    index < stepIndex ? 'bg-green-600' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Input Step */}
      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              ENS Name (without .eth)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.toLowerCase())}
                placeholder="myname"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
              />
              <span className="flex items-center px-4 bg-gray-700 rounded-lg text-gray-300 font-mono">
                .eth
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Lowercase letters, numbers, and hyphens only. Minimum 3 characters.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Duration
            </label>
            <select
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition"
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={3}>3 Years</option>
              <option value={5}>5 Years</option>
            </select>
          </div>

          {priceData && (
            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-300">Estimated Cost:</span>
                <span className="text-xl font-bold text-blue-400">
                  {(Number((priceData as any).base + (priceData as any).premium) / 1e18).toFixed(6)} ETH
                </span>
              </div>
              <p className="text-xs text-blue-300 mt-2">+ gas fees</p>
            </div>
          )}

          <button
            onClick={handleCheckAvailability}
            disabled={!name}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
          >
            Check Availability
          </button>

          {available === true && (
            <div className="bg-green-900/20 border border-green-500 rounded-lg p-4">
              <p className="text-green-400 font-semibold mb-3">
                ✅ {name}.eth is available!
              </p>
              <button
                onClick={handleStartCommit}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
              >
                Start Registration
              </button>
            </div>
          )}

          {available === false && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
              <p className="text-red-400">❌ {name}.eth is already taken</p>
            </div>
          )}
        </div>
      )}

      {/* Commit Step */}
      {step === 'commit' && (
        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h3 className="text-xl font-bold mb-2 text-yellow-400">
            {isPending ? 'Waiting for Approval...' : 'Confirming Commitment...'}
          </h3>
          <p className="text-yellow-300 text-sm">
            Please confirm the transaction in your wallet
          </p>
        </div>
      )}

      {/* Wait Step */}
      {step === 'wait' && (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-2xl font-bold mb-2">Security Delay</h3>
            <p className="text-gray-400 text-sm">
              This prevents front-running attacks. Please wait.
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 text-center mb-6">
            <div className="text-5xl font-bold text-blue-400 mb-2">
              {waitTime}s
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((60 - waitTime) / 60) * 100}%` }}
              />
            </div>
          </div>

          {waitTime === 0 && (
            <>
              <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3 mb-4">
                <p className="text-yellow-300 text-xs">
                  💡 <strong>Tip:</strong> If you get a "gas too high" error, manually set gas limit to 500,000 in MetaMask
                </p>
              </div>
              <button
                onClick={handleRegister}
                disabled={isPending}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {isPending ? 'Waiting for Approval...' : 'Complete Registration'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Register Step */}
      {step === 'register' && (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🚀</div>
          <h3 className="text-xl font-bold mb-2 text-blue-400">
            {isPending ? 'Waiting for Approval...' : isConfirming ? 'Confirming Transaction...' : 'Registering Your ENS...'}
          </h3>
          <p className="text-blue-300 text-sm">
            {isPending ? 'Please confirm the transaction in your wallet' : 'Please wait while your transaction is being confirmed on the blockchain'}
          </p>
          {isConfirming && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
            </div>
          )}
        </div>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2 text-green-400">
                Registration Complete!
              </h3>
              <p className="text-green-300 text-lg font-semibold mb-4">
                {name}.eth
              </p>
              <p className="text-gray-400 text-sm">
                Your ENS name has been successfully registered
              </p>
            </div>

            {hash && (
              <div className="space-y-3">
                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Transaction Details:</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Status:</span>
                      <span className="text-sm text-green-400 font-semibold">✅ Confirmed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">ENS Name:</span>
                      <span className="text-sm text-blue-400 font-semibold">{name}.eth</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Duration:</span>
                      <span className="text-sm text-white">{years} {years === 1 ? 'Year' : 'Years'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Owner:</span>
                      <span className="text-sm text-white font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <p className="text-xs text-gray-400 mb-2">Transaction Hash:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-mono break-all flex-1">{hash}</p>
                    <a
                      href={`https://sepolia.etherscan.io/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm whitespace-nowrap"
                    >
                      View ↗
                    </a>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-400 hover:text-white mt-2 inline-block"
                  >
                    Check your address on Etherscan ↗
                  </a>
                </div>

                <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-3">
                  <p className="text-blue-300 text-xs">
                    💡 <strong>Note:</strong> It may take a few minutes for your ENS name to appear in your profile. Please refresh the page after a minute.
                  </p>
                </div>

            
                <div className="bg-blue-900/20 border border-blue-500 rounded p-3">
                  <p className="text-blue-300 text-xs">
                    💡 <strong>Next Steps:</strong>
                  </p>
                  <ol className="text-blue-200 text-xs mt-2 space-y-1 list-decimal list-inside">
                    <li>Wait 1-2 minutes for blockchain confirmation</li>
                    <li>Go to <strong>Advanced</strong> tab</li>
                    <li>Use "🔍 Check Your ENS Names" to verify ownership</li>
                    <li>Set it as your primary name</li>
                  </ol>
                </div>
              </div>
            )}

            <button
              onClick={handleReset}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Register Another Name
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}
    </div>
  );
}
