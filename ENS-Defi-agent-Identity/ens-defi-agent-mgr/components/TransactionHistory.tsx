'use client';

import { useAccount, useChainId } from 'wagmi';
import { useState, useEffect } from 'react';

interface Transaction {
  hash: string;
  type: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: number;
}

export function TransactionHistory() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // This would normally fetch from blockchain or local storage
  // For now, showing example structure
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span>📜</span>
        <span>Transaction History</span>
      </h3>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">Your ENS transactions will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <div
              key={tx.hash}
              className="bg-gray-700 rounded p-3 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium">{tx.type}</p>
                <p className="text-xs text-gray-400">
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  tx.status === 'success'
                    ? 'bg-green-600'
                    : tx.status === 'pending'
                    ? 'bg-yellow-600'
                    : 'bg-red-600'
                }`}
              >
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
