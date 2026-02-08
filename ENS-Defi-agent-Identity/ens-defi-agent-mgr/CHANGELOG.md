# Changelog

## Version 2.0.0 - Multi-Chain & Registration Update

### 🎉 Major New Features

#### 1. Multi-Chain Support
- Added support for Ethereum Mainnet, Sepolia, Goerli, and Holesky
- Chain selector component for easy network switching
- All ENS queries now work across multiple chains
- Sepolia remains the default network

#### 2. ENS Lookup Tool
- Search any Ethereum address or ENS name
- Two modes: Address → Name and Name → Data
- Works across all supported chains
- No wallet connection required
- Displays avatar, text records, and profile data

#### 3. ENS Registration
- Register new .eth names directly from the dApp
- Available on Sepolia testnet
- Real-time availability checking
- Price calculation with duration selector (1-5 years)
- Automatic reverse record setup
- Name validation (lowercase, min 3 chars)

### 🔧 Improvements

#### Updated Components
- **ENSProfile**: Now shows current chain dynamically
- **ENSTextRecords**: Removed hardcoded Sepolia references
- **All Components**: Now chain-aware and responsive to network changes

#### Configuration
- **wagmi.ts**: Added multi-chain configuration
- **SUPPORTED_CHAINS**: Exported chain list for reuse
- **RainbowKit**: Updated to support all chains

### 📚 Documentation

#### New Files
- `MULTI-CHAIN-GUIDE.md` - Comprehensive guide for multi-chain features
- `CHANGELOG.md` - This file

#### Updated Files
- `README.md` - Updated with all new features
- `FEATURES.md` - Added new feature descriptions

### 🎨 UI/UX Enhancements
- Chain selector with visual feedback
- Current network indicators in all components
- Improved layout with new features section
- Better organization of features by function
- Responsive design maintained across new components

### 🔐 Security
- Address validation for lookups
- Chain verification before transactions
- Safe registration flow with confirmations
- Maintained all existing security features

### 📦 Components Added
- `ChainSelector.tsx` - Network switching interface
- `ENSLookup.tsx` - Universal ENS search tool
- `ENSRegistration.tsx` - ENS name registration

### 🐛 Bug Fixes
- Fixed hardcoded chain IDs in profile components
- Improved error handling for cross-chain queries
- Better loading states for async operations

### ⚡ Performance
- Efficient chain switching without page reload
- Optimized ENS queries per chain
- Reduced unnecessary re-renders

---

## Version 1.0.0 - Initial Release

### Features
- Wallet connection with RainbowKit
- ENS profile display
- Text records viewer
- Status updates
- Multi-record editor
- Avatar manager
- Content hash manager
- Primary name setter
- ENS transfer functionality
- IPFS-ready static export

### Supported Network
- Sepolia testnet only

### Components
- ENSProfile
- ENSTextRecords
- ENSStatusUpdate
- ENSMultiRecords
- ENSAvatarManager
- ENSContentHash
- ENSPrimaryName
- ENSTransfer
- WalletConnect
- Providers
