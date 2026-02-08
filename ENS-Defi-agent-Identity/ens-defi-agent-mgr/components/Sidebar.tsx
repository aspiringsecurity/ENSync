'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { SUPPORTED_CHAINS } from '@/lib/wagmi';

type Tab = 'home' | 'dashboard' | 'lookup' | 'register' | 'profile' | 'edit' | 'advanced';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const menuItems = [
    { id: 'home' as Tab, label: 'Home', icon: '🏠' },
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: '📊' },
    { id: 'lookup' as Tab, label: 'Lookup', icon: '🔍' },
    { id: 'register' as Tab, label: 'Register ENS', icon: '🎯' },
    { id: 'profile' as Tab, label: 'My Profile', icon: '👤' },
    { id: 'edit' as Tab, label: 'Edit Records', icon: '✏️' },
    { id: 'advanced' as Tab, label: 'Advanced', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4 space-y-6 fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-blue-400">ENS Manager</h1>
        <p className="text-xs text-gray-400 mt-1">Decentralized Identity</p>
      </div>

      {/* Navigation Menu */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Navigation</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Chain Selector */}
      <div className="space-y-2 pt-6 border-t border-gray-700">
        <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Networks</p>
        {SUPPORTED_CHAINS.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-sm transition ${
              chainId === chain.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span>{chain.name}</span>
            {chain.isDefault && <span className="text-xs">⭐</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
