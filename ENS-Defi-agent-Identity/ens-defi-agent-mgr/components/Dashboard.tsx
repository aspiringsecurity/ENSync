'use client';

import { useAccount, useEnsAvatar, useEnsText, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';
import { useENS } from './ENSContext';
import Image from 'next/image';

type Tab = 'home' | 'dashboard' | 'lookup' | 'register' | 'profile' | 'edit' | 'advanced';

interface DashboardProps {
  onNavigate?: (tab: Tab) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { selectedName, setSelectedName, allNames, loading, primaryName } = useENS();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch ENS records
  const { data: ensAvatar } = useEnsAvatar({
    name: selectedName || undefined,
    chainId,
  });

  const { data: headerImage } = useEnsText({
    name: selectedName || undefined,
    key: 'header',
    chainId,
  });

  const { data: description } = useEnsText({
    name: selectedName || undefined,
    key: 'description',
    chainId,
  });

  const { data: location } = useEnsText({
    name: selectedName || undefined,
    key: 'location',
    chainId,
  });

  const { data: email } = useEnsText({
    name: selectedName || undefined,
    key: 'email',
    chainId,
  });

  const { data: url } = useEnsText({
    name: selectedName || undefined,
    key: 'url',
    chainId,
  });

  const { data: twitter } = useEnsText({
    name: selectedName || undefined,
    key: 'com.twitter',
    chainId,
  });

  const { data: github } = useEnsText({
    name: selectedName || undefined,
    key: 'com.github',
    chainId,
  });

  const { data: discord } = useEnsText({
    name: selectedName || undefined,
    key: 'com.discord',
    chainId,
  });

  const { data: telegram } = useEnsText({
    name: selectedName || undefined,
    key: 'org.telegram',
    chainId,
  });

  if (!mounted) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔌</div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">Connect your wallet to view your ENS dashboard</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your ENS names...</p>
      </div>
    );
  }

  if (!selectedName) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold mb-2">No ENS Names Found</h2>
        <p className="text-gray-400 mb-4">Register an ENS name to get started</p>
        <button 
          onClick={() => onNavigate?.('register')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
        >
          Register ENS Name
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ENS Name Selector */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-1">My ENS Names</h3>
            <p className="text-xs text-gray-400">Select which ENS to view</p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {allNames.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedName(domain.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  selectedName === domain.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {domain.name}
                {domain.name === primaryName && ' ⭐'}
              </button>
            ))}
          </div>
        </div>
      </div>

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
              {location && (
                <p className="text-gray-400 flex items-center gap-1 mt-1">
                  📍 {location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          {description && (
            <p className="text-gray-300 mb-4">{description}</p>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {email && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">📧</span>
                <a href={`mailto:${email}`} className="text-blue-400 hover:underline">
                  {email}
                </a>
              </div>
            )}
            {url && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">🌐</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                  {url}
                </a>
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="flex gap-3 flex-wrap">
            {twitter && (
              <a
                href={`https://twitter.com/${twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
              >
                🐦 Twitter
              </a>
            )}
            {github && (
              <a
                href={`https://github.com/${github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
              >
                💻 GitHub
              </a>
            )}
            {discord && (
              <div className="bg-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                💬 {discord}
              </div>
            )}
            {telegram && (
              <a
                href={`https://t.me/${telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
              >
                ✈️ Telegram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-2xl">
              🏷️
            </div>
            <div>
              <p className="text-2xl font-bold">{selectedName}</p>
              <p className="text-sm text-gray-400">ENS Name</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-2xl">
              📝
            </div>
            <div>
              <p className="text-2xl font-bold">
                {[email, url, twitter, github, discord, telegram].filter(Boolean).length}
              </p>
              <p className="text-sm text-gray-400">Records Set</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
              🔗
            </div>
            <div>
              <p className="text-2xl font-bold">{address?.slice(0, 6)}...{address?.slice(-4)}</p>
              <p className="text-sm text-gray-400">Wallet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={() => onNavigate?.('edit')}
            className="bg-blue-600 hover:bg-blue-700 rounded-lg p-4 text-center transition"
          >
            <div className="text-2xl mb-2">✏️</div>
            <div className="text-sm font-medium">Edit Records</div>
          </button>
          <button 
            onClick={() => onNavigate?.('register')}
            className="bg-green-600 hover:bg-green-700 rounded-lg p-4 text-center transition"
          >
            <div className="text-2xl mb-2">🎯</div>
            <div className="text-sm font-medium">Register New</div>
          </button>
          <button 
            onClick={() => onNavigate?.('advanced')}
            className="bg-purple-600 hover:bg-purple-700 rounded-lg p-4 text-center transition"
          >
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-sm font-medium">Set Primary</div>
          </button>
          <button 
            onClick={() => onNavigate?.('edit')}
            className="bg-orange-600 hover:bg-orange-700 rounded-lg p-4 text-center transition"
          >
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-sm font-medium">IPFS Deploy</div>
          </button>
        </div>
      </div>
    </div>
  );
}
