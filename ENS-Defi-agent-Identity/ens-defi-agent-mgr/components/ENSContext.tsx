'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useEnsName, useChainId } from 'wagmi';
import { getENSNamesForAddress, ENSDomain } from '@/lib/getENSNames';

interface ENSContextType {
  selectedName: string;
  setSelectedName: (name: string) => void;
  allNames: ENSDomain[];
  loading: boolean;
  primaryName: string | null;
}

const ENSContext = createContext<ENSContextType | undefined>(undefined);

export function ENSProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [allNames, setAllNames] = useState<ENSDomain[]>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { data: primaryName } = useEnsName({
    address,
    chainId,
  });

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch all ENS names
  useEffect(() => {
    const fetchNames = async () => {
      if (!address || !mounted) return;
      
      setLoading(true);
      const result = await getENSNamesForAddress(address, chainId);
      
      if (result.domains && result.domains.length > 0) {
        setAllNames(result.domains);
        // Set primary name as default, or first name
        if (primaryName) {
          setSelectedName(primaryName);
        } else if (!selectedName) {
          setSelectedName(result.domains[0].name);
        }
      }
      setLoading(false);
    };

    if (isConnected && address && mounted) {
      fetchNames();
    }
  }, [address, chainId, isConnected, mounted]);

  // Update selected name when primary name changes
  useEffect(() => {
    if (primaryName && !selectedName && mounted) {
      setSelectedName(primaryName);
    }
  }, [primaryName, mounted]);

  // Don't render context until mounted to avoid hydration mismatch
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ENSContext.Provider value={{ selectedName, setSelectedName, allNames, loading, primaryName: primaryName || null }}>
      {children}
    </ENSContext.Provider>
  );
}

export function useENS() {
  const context = useContext(ENSContext);
  if (context === undefined) {
    throw new Error('useENS must be used within an ENSProvider');
  }
  return context;
}
