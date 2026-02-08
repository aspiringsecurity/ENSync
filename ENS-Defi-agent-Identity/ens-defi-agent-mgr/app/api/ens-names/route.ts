import { NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'wagmi/chains';
import { getNamesForAddress } from '@ensdomains/ensjs/subgraph';
import { addEnsContracts } from '@ensdomains/ensjs';

interface ENSDomain {
  name: string;
  labelName: string | null;
  id: string;
  createdAt?: string;
  expiryDate?: string;
}

function getRpcUrl(chainId: number): string {
  if (chainId === sepolia.id) {
    return process.env.NEXT_PUBLIC_SEPOLIA_RPC || 'https://rpc.sepolia.org';
  }
  return process.env.NEXT_PUBLIC_MAINNET_RPC || 'https://eth.llamarpc.com';
}

function getClient(chainId: number) {
  const baseChain = chainId === sepolia.id ? sepolia : mainnet;
  const chain = addEnsContracts(baseChain);
  
  return createPublicClient({
    chain,
    transport: http(getRpcUrl(chainId)),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, chainId } = body as { address?: string; chainId?: number };

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    console.log(`API: Fetching ENS names for ${address} on chain ${chainId}`);

    const client = getClient(chainId || sepolia.id);
    
    // Use ENS.js to get names owned by this address
    const result = await getNamesForAddress(client, {
      address: address as `0x${string}`,
      filter: {
        owner: true,
        registrant: true,
        wrappedOwner: true,
        resolvedAddress: false,
      },
    });

    console.log(`API: ENS.js returned ${result?.length || 0} names`);

    if (!result || result.length === 0) {
      return NextResponse.json({ domains: [] });
    }

    // Transform to our domain format
    const domains: ENSDomain[] = result.map((name: any) => ({
      id: name.id || name.name,
      name: name.name,
      labelName: name.labelName || null,
      createdAt: name.createdAt?.toString(),
      expiryDate: name.expiryDate?.toString(),
    }));

    console.log(`API: Returning ${domains.length} domains`);
    return NextResponse.json({ domains });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('API /ens-names failed:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
