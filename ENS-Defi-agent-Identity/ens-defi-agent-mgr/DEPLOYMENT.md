# ENS Profile Manager for DeFi agents- Deployment Guide

## Prerequisites

1. **WalletConnect Project ID**
   - Visit https://cloud.walletconnect.com/
   - Create a new project
   - Copy your Project ID

2. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local and add your WalletConnect Project ID
   ```

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Build for IPFS Deployment

```bash
npm run build
```

This creates a static export in the `out/` directory.

## Deploy to IPFS

### Option 1: Using IPFS Desktop

1. Install IPFS Desktop from https://docs.ipfs.tech/install/ipfs-desktop/
2. Add the `out/` folder to IPFS
3. Copy the CID (Content Identifier)

### Option 2: Using Pinata

1. Visit https://pinata.cloud/
2. Upload the `out/` folder
3. Get the IPFS hash

## Link to ENS

1. Go to https://app.ens.domains/ (on Sepolia)
2. Select your ENS name
3. Go to "Records" tab
4. Set the "Content Hash" to your IPFS CID:
   - Format: `ipfs://YOUR_CID_HERE`
5. Save and confirm transaction

## Access Your dApp

Your dApp will be accessible at:
- `https://YOUR_NAME.eth.limo` (via eth.limo gateway)
- `https://YOUR_NAME.eth.link` (via eth.link gateway)
- Any IPFS gateway: `https://ipfs.io/ipfs/YOUR_CID`

## Testing on Sepolia

1. Get Sepolia ETH from faucet: https://sepoliafaucet.com/
2. Register an ENS name on Sepolia: https://app.ens.domains/
3. Connect wallet to your dApp
4. Update your status and text records

## Important Notes

- The dApp is configured for Sepolia testnet only
- Users must have an ENS name on Sepolia to update records
- Static export is optimized for IPFS hosting
- All images are unoptimized for static export compatibility
