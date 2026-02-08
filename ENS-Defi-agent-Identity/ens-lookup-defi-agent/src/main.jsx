// ┌─────────────────────────────────────────────────────────┐
// │  PURPOSE: Configure connection to Ethereum blockchain   │
// │  RUNS: Once when app starts                             │
// └─────────────────────────────────────────────────────────┘

import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

// ┌─────────────────────────────────────────┐
// │  STEP 1: Create Ethereum connection     │
// └─────────────────────────────────────────┘
const config = createConfig({
  chains: [mainnet],              // Connect to Ethereum mainnet
  transports: {
    [mainnet.id]: http('/rpc')    // Use Vite proxy to bypass CORS
  }
})

// ┌─────────────────────────────────────────┐
// │  STEP 2: Create React Query client      │
// │  (Wagmi uses this for caching)          │
// └─────────────────────────────────────────┘
const queryClient = new QueryClient()

// ┌─────────────────────────────────────────┐
// │  STEP 3: Wrap app with providers        │
// │  This gives App.jsx access to Wagmi     │
// └─────────────────────────────────────────┘
ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <App />                     {/* Your main app component */}
    </QueryClientProvider>
  </WagmiProvider>
)