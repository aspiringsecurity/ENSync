## ENS Profile Management for DeFi Agents

We are building a decentralized profile management layer for DeFi agents powered by ENS. This module allows agents (and their operators) to manage on-chain identity, metadata, and discoverability using ENS as the canonical identity layer.

Built with Next.js, wagmi, viem, and RainbowKit, the dApp enables seamless wallet connection, multi-chain ENS querying, and full ENS profile editing from a single interface.

This acts as an identity control panel for DeFi agents — making ENS the programmable profile for autonomous actors.


## Tech Stack

- **Next.js 16** - App Router with TypeScript and Static Export
- **wagmi** - React Hooks for Ethereum
- **viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **@ensdomains/ensjs** - ENS JavaScript library for client-side queries
- **Tailwind CSS** - Styling
- **Multi-Chain Support** - Ethereum Mainnet, Sepolia, Goerli, Holesky
- **ENS** - Ethereum Name Service
- **Static Export** - Fully client-side, no API routes required

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. A WalletConnect Project ID (get one at https://cloud.walletconnect.com/)
3. MetaMask or another Web3 wallet
4. Sepolia ETH for registration (get from https://sepoliafaucet.com/)
5. Optional: Mainnet ETH for mainnet operations

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your WalletConnect Project ID to `.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

Build static export for IPFS or static hosting:

```bash
npm run build
```

The static files will be in the `out/` directory.


## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions on deploying to IPFS and linking to your ENS name.

Vercel Deployment Link: https://ens-manager-bay.vercel.app/

The app is built as a static export and can be deployed to IPFS, GitHub Pages, Vercel, Netlify, or any static hosting service.

## Core Module Functionality

### 1. Multi-Chain Support
- Switch between Ethereum Mainnet, Sepolia, Goerli, and Holesky
- Query ENS data from any supported chain
- Sepolia set as default network
- Visual chain selector with current network indicator

### 2. ENS Lookup (Any Address/Name)
- **Address → Name**: Resolve ENS name from any Ethereum address
- **Name → Data**: Look up profile data for any ENS name
- Works across all supported chains
- Displays avatar, text records, and profile information
- No wallet connection required for lookups

### 3. ENS Registration
- Register new .eth names directly from the dApp
- Available on Sepolia testnet
- Real-time availability checking
- Price calculation with duration selector (1-5 years)
- Automatic reverse record setup
- Name validation (lowercase, min 3 chars)

### 4. Wallet Connection
- Uses RainbowKit's ConnectButton
- Supports multiple chains
- Automatic network detection

### 5. ENS Resolution
- Automatically resolves ENS name from connected address
- Handles cases where no ENS exists
- Uses `useEnsName` hook

### 6. ENS Profile Display
- Shows ENS name and avatar
- Displays shortened wallet address
- Shows current network dynamically
- Uses `useEnsAvatar` and `useAccount` hooks

### 7. ENS Text Records Viewer
- Reads and displays:
  - `status` - Custom status message
  - `com.twitter` - Twitter handle
  - `com.github` - GitHub username
- Uses `useEnsText` hook

### 8. Status Update
- Quick update for status text record
- Only allows write if user owns the ENS name
- Shows transaction status (pending, confirming, success)
- Uses `useEnsResolver` and `useWriteContract` hooks

### 9. Multi-Record Editor
- Edit multiple text records:
  - Email, Website, Bio/Description
  - Discord, Reddit, Telegram handles
- Dropdown selector for record type
- Shows current value before updating
- Single transaction per record update

### 10. Avatar Manager
- Set avatar from two sources:
  - **URL**: Direct link to image file
  - **NFT**: ERC-721 token (format: eip155:chainId/erc721:contract/tokenId)
- Preview current avatar
- Updates `avatar` text record

### 11. Content Hash Manager
- View current IPFS content hash
- Update content hash for decentralized website hosting
- Supports IPFS CID format (ipfs://Qm...) or raw bytes
- Essential for hosting dApp on ENS

### 12. Primary Name Setter
- Set ENS name as primary (reverse record)
- Makes your ENS appear when apps look up your address
- One-click setup with confirmation
- Uses Reverse Registrar contract

### 13. ENS Transfer
- Transfer ENS ownership to another address
- **WARNING**: Irreversible action with safety checks
- Requires typing ENS name to confirm
- Validates recipient address format
- Uses ENS Registry contract

## Error Handling

The dApp handles:
- No ENS found for address
- Resolver not set
- User rejects transaction
- Wrong network (not Sepolia)
- Transaction failures

All errors show user-friendly messages.

## Module Structure

```
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main page with all components
│   └── globals.css         # Global styles
├── components/
│   ├── Providers.tsx       # Wagmi & RainbowKit providers
│   ├── WalletConnect.tsx   # Wallet connection button
│   ├── ChainSelector.tsx   # Multi-chain network selector
│   ├── ENSLookup.tsx       # Search any address/name
│   ├── ENSRegistration.tsx # Register new ENS names
│   ├── ENSProfile.tsx      # ENS profile display
│   ├── ENSTextRecords.tsx  # Text records viewer
│   ├── ENSStatusUpdate.tsx # Quick status update
│   ├── ENSMultiRecords.tsx # Multi-record editor
│   ├── ENSAvatarManager.tsx # Avatar management
│   ├── ENSContentHash.tsx  # Content hash manager
│   ├── ENSPrimaryName.tsx  # Primary name setter
│   └── ENSTransfer.tsx     # ENS ownership transfer
├── lib/
│   ├── wagmi.ts           # Wagmi configuration
│   └── ens.ts             # ENS utilities & ABIs
└── DEPLOYMENT.md          # Deployment guide
```

## License

MIT
