'use client';

import { WalletConnect } from './WalletConnect';

export function TopBar() {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">ENS Manager</h2>
          <p className="text-sm text-gray-400">Manage your ENS names</p>
        </div>
        <WalletConnect />
      </div>
    </div>
  );
}
