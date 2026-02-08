import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import { addEnsContracts } from '@ensdomains/ensjs';
import { getNamesForAddress } from '@ensdomains/ensjs/subgraph';

export interface ENSDomain {
  name: string;
  labelName: string | null;
  id: string;
  createdAt?: string;
  expiryDate?: string;
  tokenId?: string;
}

// Get RPC URL for chain
function getRpcUrl(chainId: number): string {
  if (chainId === sepolia.id) {
    return process.env.NEXT_PUBLIC_SEPOLIA_RPC || 'https://rpc.sepolia.org';
  }
  return process.env.NEXT_PUBLIC_MAINNET_RPC || 'https://eth.llamarpc.com';
}

// Create a public client for the chain with ENS contracts
function getClient(chainId: number) {
  const baseChain = chainId === sepolia.id ? sepolia : mainnet;
  const chain = addEnsContracts(baseChain);
  
  return createPublicClient({
    chain,
    transport: http(getRpcUrl(chainId)),
  });
}

export async function getENSNamesForAddress(
  address: string,
  chainId: number
): Promise<{ domains: ENSDomain[]; error?: string }> {
  
  console.log('🔍 getENSNamesForAddress called');
  console.log('  - Address:', address);
  console.log('  - Chain ID:', chainId);

  // Use ENS.js directly (works in both browser and server)
  try {
    const client = getClient(chainId);
    
    console.log('📊 Fetching ENS names using @ensdomains/ensjs...');
    
    const result = await getNamesForAddress(client, {
      address: address as `0x${string}`,
      filter: {
        owner: true,
        registrant: true,
        wrappedOwner: true,
        resolvedAddress: false,
      },
    });

    console.log('✅ ENS.js result:', result);

    if (!result || result.length === 0) {
      return {
        domains: [],
        error: 'No ENS names found for this address',
      };
    }

    // Transform to our domain format
    const domains: ENSDomain[] = result.map((name: any) => ({
      id: name.id || name.name,
      name: name.name,
      labelName: name.labelName || null,
      createdAt: name.createdAt?.toString(),
      expiryDate: name.expiryDate?.toString(),
    }));

    console.log(`✅ Found ${domains.length} ENS names`);
    return { domains };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ ENS.js error:', message);
    return {
      domains: [],
      error: `Failed to fetch ENS names: ${message}`,
    };
  }
}

// Backwards compatibility export
export async function getENSNamesViaRegistry(
  address: string,
  chainId: number
): Promise<string[]> {
  const result = await getENSNamesForAddress(address, chainId);
  return result.domains.map(d => d.name);
}
