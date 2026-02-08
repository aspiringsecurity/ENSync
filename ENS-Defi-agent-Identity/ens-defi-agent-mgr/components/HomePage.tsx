'use client';

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          ENS Profile Manager
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your complete solution for managing Ethereum Name Service profiles
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition">
            Get Started
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-lg font-semibold transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">ENS Lookup</h3>
          <p className="text-gray-400 text-sm">
            Search any Ethereum address or ENS name across multiple chains instantly
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-bold mb-2">Register Names</h3>
          <p className="text-gray-400 text-sm">
            Register new .eth names directly from the app with our easy 2-step process
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-xl font-bold mb-2">Manage Profile</h3>
          <p className="text-gray-400 text-sm">
            View and edit your ENS profile, avatar, and text records
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
          <div className="text-4xl mb-4">✏️</div>
          <h3 className="text-xl font-bold mb-2">Edit Records</h3>
          <p className="text-gray-400 text-sm">
            Update email, website, social media handles, and more
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
          <div className="text-4xl mb-4">🌐</div>
          <h3 className="text-xl font-bold mb-2">Multi-Chain</h3>
          <p className="text-gray-400 text-sm">
            Support for Ethereum Mainnet, Sepolia, Goerli, and Holesky
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold mb-2">Advanced Tools</h3>
          <p className="text-gray-400 text-sm">
            Content hash, primary name, and ownership transfer features
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">4+</div>
            <div className="text-blue-100">Supported Networks</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10+</div>
            <div className="text-blue-100">Features</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">100%</div>
            <div className="text-blue-100">Decentralized</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-800 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              1️⃣
            </div>
            <h4 className="font-bold mb-2">Connect Wallet</h4>
            <p className="text-sm text-gray-400">Connect your Web3 wallet to get started</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              2️⃣
            </div>
            <h4 className="font-bold mb-2">Choose Network</h4>
            <p className="text-sm text-gray-400">Select your preferred blockchain network</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              3️⃣
            </div>
            <h4 className="font-bold mb-2">Manage ENS</h4>
            <p className="text-sm text-gray-400">Register, edit, or lookup ENS names</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              4️⃣
            </div>
            <h4 className="font-bold mb-2">Done!</h4>
            <p className="text-sm text-gray-400">Your changes are live on the blockchain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
