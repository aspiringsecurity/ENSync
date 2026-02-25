# **ENSync**

**ENS-native autonomous agents for decentralized coordination and on-chain execution using libp2p**

ENSync is a decentralized system that enables autonomous agents to coordinate financial actions using human-readable ENS identities, peer-to-peer networking, and Uniswap V4 execution. It demonstrates how identity, coordination, and liquidity can be composed into a trust-minimized agent economy without centralized infrastructure.

---

## 🌐 What is ENSync?

Today’s DeFi agents and bots are anonymous, opaque, and coordinated through centralized servers. ENSync introduces a new primitive:

> **ENS as identity → libp2p as coordination → Uniswap V4 as execution**

Each agent is represented by an ENS name that exposes metadata, social context, and live status. Agents discover and communicate with each other over libp2p, negotiate intent off-chain, and settle final execution on Uniswap V4 using hooks for verifiable on-chain tracking.

---

## 🧠 Core Concepts

### **ENS-Native Agent Identity**

* Agents are bound to ENS names, not random addresses
* ENS text records store agent metadata (strategy, status, links)
* ENS avatars provide recognizable identity for humans and tools
* ENS resolution is embedded directly into agent discovery

### **Peer-to-Peer Coordination**

* Agents discover peers via libp2p (mDNS + gossipsub)
* No centralized servers or APIs
* Agents negotiate swap intent off-chain to reduce costs and latency
* Identity verification happens before coordination

### **Uniswap V4 Execution & Observability**

* Swaps execute on Uniswap V4 (Sepolia)
* Custom hook tracks per-agent swap activity
* On-chain events provide verifiable behavior signals
* Enables composable reputation and analytics

---

## 🏗 Architecture Overview

```
┌──────────────────────┐     ┌──────────────────────┐
│  ENS Profile Layer   │     │  ENS Profile Layer   │
│  agent-alice.eth     │     │  agent-bob.eth       │
└─────────┬────────────┘     └─────────┬────────────┘
          │ ENS resolution                        │
          ▼                                       ▼
┌──────────────────────────────────────────────────────┐
│                libp2p Agent Network                   │
│        (Discovery, Messaging, Coordination)           │
└─────────┬──────────────────────────────┬────────────┘
          │ Off-chain intent               │
          │ negotiation                    │
          ▼                                ▼
┌──────────────────────────────────────────────────────┐
│              Uniswap V4 Pool Manager                  │
│        Custom Hook: Agent Swap Tracking               │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Features

* ✅ ENS-based identity for autonomous agents
* ✅ Peer-to-peer discovery and messaging via libp2p
* ✅ Off-chain coordination with on-chain settlement
* ✅ Uniswap V4 hook for per-agent activity tracking
* ✅ Verifiable on-chain behavior signals
* ✅ Frontend for ENS lookup and agent introspection

---

## 🛠 Tech Stack

### **On-Chain**

* Uniswap V4 (Sepolia)
* Custom Hook contracts (Foundry)
* Solidity

### **Agents**

* Rust
* rust-libp2p (gossipsub, mDNS)
* Alloy / ethers-rs for Ethereum interaction

### **Frontend**

* React / Next.js
* wagmi + viem
* RainbowKit
* ENS.js
* Tailwind CSS

---

## 🧪 Example Flow

1. Agent launches with ENS name `agent-alice.eth`
2. Peer agent discovers it over libp2p
3. ENS profile is resolved and verified
4. Agents negotiate swap intent off-chain
5. Swap executes on Uniswap V4
6. Hook emits event tracking agent activity
7. On-chain state reflects agent behavior

---

## 🛒 Commerce & On/Off-Ramp Experiments

ENSync naturally extends to decentralized commerce scenarios:

* Merchant agents advertise ENS profiles
* Buyers negotiate payments peer-to-peer
* Asset conversion happens via Uniswap V4
* No centralized marketplace or escrow required

This enables experimentation with trust-minimized on/off-ramp and payment coordination models driven by autonomous agents.

---

## 🧩 Why ENSync Matters

### **For ENS**

* Positions ENS as a programmable identity layer for agents
* Demonstrates live metadata, reputation, and discoverability
* Moves ENS beyond naming into coordination infrastructure

### **For Uniswap**

* Highlights Uniswap V4 hooks as observability and coordination primitives
* Demonstrates agent-driven liquidity execution
* Enables new classes of automated market participants

### **For the Agent Economy**

* Replaces anonymous bots with identity-aware agents
* Enables composable, verifiable agent behavior
* Lays groundwork for cooperative autonomous systems

---

## 📽 Demo

[🔗](https://drive.google.com/drive/folders/1NeKDIqq0DNT3LOuY0ey7O38aNzsfLndr?usp=drive_link) 

---

## 🛣 Roadmap

* [ ] Agent reputation scoring via ENS + hook data
* [ ] Strategy discovery and matching
* [ ] Multi-agent swap coordination
* [ ] Persistent agent state channels
* [ ] Cross-chain ENS-identified agents

---

## 📜 License

MIT

