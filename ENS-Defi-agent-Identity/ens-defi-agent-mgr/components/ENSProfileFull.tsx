'use client';

import { useAccount, useEnsAvatar, useEnsText, useChainId, useEnsAddress } from 'wagmi';
import { useENS } from './ENSContext';
import { shortenAddress } from '@/lib/ens';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';
import Image from 'next/image';

const TEXT_RECORDS = [
  { key: 'email', label: 'Email', icon: '📧' },
  { key: 'url', label: 'Website', icon: '🌐' },
  { key: 'description', label: 'Bio', icon: '📝' },
  { key: 'location', label: 'Location', icon: '📍' },
  { key: 'phone', label: 'Phone', icon: '📱' },
  { key: 'notice', label: 'Notice', icon: '📢' },
  { key: 'keywords', label: 'Keywords', icon: '🏷️' },
  { key: 'com.twitter', label: 'Twitter', icon: '🐦' },
  { key: 'com.github', label: 'GitHub', icon: '💻' },
  { key: 'com.discord', label: 'Discord', icon: '💬' },
  { key: 'com.reddit', label: 'Reddit', icon: '🤖' },
  { key: 'org.telegram', label: 'Telegram', icon: '✈️' },
  { key: 'com.linkedin', label: 'LinkedIn', icon: '💼' },
  { key: 'com.youtube', label: 'YouTube', icon: '📺' },
  { key: 'com.instagram', label: 'Instagram', icon: '📷' },
  { key: 'io.keybase', label: 'Keybase', icon: '🔑' },
];

const CRYPTO_ADDRESSES = [
  { key: 'ETH', label: 'Ethereum', icon: '⟠', coinType: 60n },
  { key: 'BTC', label: 'Bitcoin', icon: '₿', coinType: 0n },
  { key: 'LTC', label: 'Litecoin', icon: 'Ł', coinType: 2n },
  { key: 'DOGE', label: 'Dogecoin', icon: 'Ð', coinType: 3n },
];

export function ENSProfileFull() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const currentChain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  const { selectedName, loading } = useENS();

  const { data: ensAvatar } = useEnsAvatar({
    name: selectedName || undefined,
    chainId,
  });

  const { data: headerImage } = useEnsText({
    name: selectedName || undefined,
    key: 'header',
    chainId,
  });

  const { data: ethAddress } = useEnsAddress({
    name: selectedName || undefined,
    chainId,
  });

  if (!isConnected || !address) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Connect your wallet to view ENS profile</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Loading ENS profile...</p>
      </div>
    );
  }

  if (!selectedName) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <p className="text-gray-400">Select an ENS name to view profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header with Banner */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {/* Banner/Header Image */}
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600">
          {headerImage ? (
            <Image
              src={headerImage}
              alt="Header"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
          )}
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar - overlapping banner */}
          <div className="flex items-end gap-4 -mt-16 mb-4">
            {ensAvatar ? (
              <Image
                src={ensAvatar}
                alt="Avatar"
                width={120}
                height={120}
                className="rounded-full border-4 border-gray-800 bg-gray-800"
              />
            ) : (
              <div className="w-30 h-30 bg-gray-700 rounded-full border-4 border-gray-800 flex items-center justify-center text-5xl">
                👤
              </div>
            )}
            
            <div className="mb-2">
              <h2 className="text-3xl font-bold">{selectedName}</h2>
              <p className="text-gray-400 text-sm mt-1">
                {shortenAddress(address)}
              </p>
            </div>
          </div>

          {/* Network Info */}
          <div className="bg-gray-700 rounded p-3 mb-4">
            <p className="text-sm text-gray-400">
              <span className="font-semibold">Network:</span> {currentChain?.name || 'Unknown'}
            </p>
            {ethAddress && (
              <p className="text-sm text-gray-400 mt-1">
                <span className="font-semibold">Resolves to:</span> {shortenAddress(ethAddress)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Text Records */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">📝 Text Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TEXT_RECORDS.map((record) => (
            <TextRecordDisplay key={record.key} record={record} ensName={selectedName} />
          ))}
        </div>
      </div>

      {/* Crypto Addresses */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">💰 Cryptocurrency Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CRYPTO_ADDRESSES.map((crypto) => (
            <CryptoAddressDisplay key={crypto.key} crypto={crypto} ensName={selectedName} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TextRecordDisplay({ record, ensName }: { record: typeof TEXT_RECORDS[0]; ensName: string }) {
  const chainId = useChainId();
  const { data: value } = useEnsText({
    name: ensName,
    key: record.key,
    chainId,
  });

  return (
    <div className="bg-gray-700 rounded p-3">
      <div className="flex items-center gap-2 mb-1">
        <span>{record.icon}</span>
        <span className="font-semibold text-sm">{record.label}</span>
      </div>
      <p className="text-gray-300 text-sm ml-6 break-all">
        {value ? (
          record.key.startsWith('com.') || record.key.startsWith('org.') || record.key.startsWith('io.') ? (
            <a
              href={getSocialLink(record.key, value)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              {value}
            </a>
          ) : record.key === 'url' ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {value}
            </a>
          ) : record.key === 'email' ? (
            <a href={`mailto:${value}`} className="text-blue-400 hover:underline">
              {value}
            </a>
          ) : (
            value
          )
        ) : (
          <span className="text-gray-500 italic">Not set</span>
        )}
      </p>
    </div>
  );
}

function CryptoAddressDisplay({ crypto, ensName }: { crypto: typeof CRYPTO_ADDRESSES[0]; ensName: string }) {
  const chainId = useChainId();
  const { data: address } = useEnsAddress({
    name: ensName,
    chainId,
    coinType: crypto.coinType,
  });

  return (
    <div className="bg-gray-700 rounded p-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{crypto.icon}</span>
        <span className="font-semibold text-sm">{crypto.label}</span>
      </div>
      <p className="text-gray-300 text-xs ml-7 break-all font-mono">
        {address || <span className="text-gray-500 italic">Not set</span>}
      </p>
    </div>
  );
}

function getSocialLink(key: string, value: string): string {
  const username = value.startsWith('@') ? value.slice(1) : value;
  
  switch (key) {
    case 'com.twitter':
      return `https://twitter.com/${username}`;
    case 'com.github':
      return `https://github.com/${username}`;
    case 'com.reddit':
      return `https://reddit.com/u/${username}`;
    case 'org.telegram':
      return `https://t.me/${username}`;
    case 'com.linkedin':
      return `https://linkedin.com/in/${username}`;
    case 'com.youtube':
      return `https://youtube.com/@${username}`;
    case 'com.instagram':
      return `https://instagram.com/${username}`;
    case 'io.keybase':
      return `https://keybase.io/${username}`;
    default:
      return '#';
  }
}
