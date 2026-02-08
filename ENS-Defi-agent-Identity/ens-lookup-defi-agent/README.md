# ENS Explorer for DeFi agents

A lightweight ENS lookup dApp built with **React**, **Wagmi**, and **Vite**. Resolve ENS names and Ethereum addresses, view avatars and common ENS text records (description, twitter, website, email).

Features
- Resolve ENS names ↔ Ethereum addresses
- Display ENS avatar and text records
- Manual search (prevents excess RPC calls) and Vite proxy to avoid CORS during development
- React Query caching to reduce repeated RPC requests

Quick start
1. npm install
2. npm run dev
3. Open http://localhost:5174 and use the search box (press Enter or click Search)


License
MIT
