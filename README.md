# Nano Connect

A WalletConnect-inspired protocol for Nano cryptocurrency that enables secure communication between dApps and Nano wallets through QR codes and deep links.

## Overview

Nano Connect is a lightweight, secure protocol that allows web applications to request wallet actions (authentication, signing, account data) from Nano wallets without requiring direct key management. Similar to WalletConnect but specifically designed for the Nano ecosystem.

## Architecture

Nano Connect consists of two main components:

### 1. Backend Relay Server (NestJS)
A WebSocket-based relay bridge server that routes encrypted messages between dApps and wallets.

**Features:**
- WebSocket relay for real-time bidirectional communication
- Topic-based pub/sub message routing
- JWT-based authentication for secure sessions
- Public endpoints for session initialization
- Private endpoints for authenticated operations
- Message persistence with TTL (Time To Live)
- Health monitoring and metrics

**Tech Stack:**
- NestJS framework
- WebSocket (Socket.io or native WS)
- Redis for session/message caching
- PostgreSQL for persistence
- JWT for authentication

### 2. Frontend SDK (TypeScript)
A lightweight TypeScript SDK for dApps to integrate Nano wallet connectivity.

**Features:**
- QR code generation for mobile wallet pairing
- Deep link generation for native wallet apps
- Session management (create, approve, reject, disconnect)
- Request signing from wallets
- Account data retrieval
- Event-based architecture for real-time updates
- TypeScript type definitions

## How It Works

```
┌─────────────┐                    ┌──────────────┐                    ┌──────────────┐
│   dApp      │                    │    Relay     │                    │    Wallet    │
│  (Browser)  │                    │    Server    │                    │   (Mobile)   │
└──────┬──────┘                    └──────┬───────┘                    └──────┬───────┘
       │                                  │                                   │
       │  1. Connect Request              │                                   │
       │─────────────────────────────────>│                                   │
       │  (Generate session topic)        │                                   │
       │                                  │                                   │
       │  2. Display QR Code/Deep Link    │                                   │
       │  (Contains: topic, relay URL)    │                                   │
       │                                  │                                   │
       │                                  │  3. Scan QR/Open Deep Link        │
       │                                  │<──────────────────────────────────│
       │                                  │                                   │
       │                                  │  4. Subscribe to topic            │
       │                                  │<──────────────────────────────────│
       │                                  │                                   │
       │                                  │  5. Session Proposal              │
       │                                  │───────────────────────────────────>│
       │                                  │                                   │
       │                                  │  6. User Approves                 │
       │                                  │<──────────────────────────────────│
       │  7. Session Approved             │  (Sends accounts, public key)     │
       │<─────────────────────────────────│                                   │
       │                                  │                                   │
       │  8. Request Signature            │                                   │
       │─────────────────────────────────>│───────────────────────────────────>│
       │                                  │                                   │
       │                                  │  9. User Signs                    │
       │  10. Signature Response          │<──────────────────────────────────│
       │<─────────────────────────────────│                                   │
       │                                  │                                   │
```

## Key Features

### 🔒 Security
- End-to-end encryption using X25519 key exchange
- JWT-based session authentication
- No private keys stored on relay server
- Message integrity verification
- Secure random topic generation

### 🚀 Performance
- Real-time WebSocket communication
- Message caching for offline delivery
- Automatic reconnection handling
- Efficient pub/sub routing

### 🎯 Simplicity
- Simple SDK integration (< 10 lines of code)
- QR code + deep link support
- Clear error handling
- TypeScript support out of the box

### 🔌 Nano-Specific Features
- Account balance queries
- Block signing requests
- Representative change requests
- Account info retrieval
- Pending blocks fetching

## Project Structure

```
nano-connect/
├── backend/                    # NestJS relay server
│   ├── src/
│   │   ├── auth/              # JWT authentication
│   │   ├── relay/             # WebSocket relay logic
│   │   ├── session/           # Session management
│   │   ├── message/           # Message handling
│   │   └── common/            # Shared utilities
│   ├── test/
│   └── package.json
│
├── sdk/                        # TypeScript SDK
│   ├── src/
│   │   ├── client/            # Main client class
│   │   ├── session/           # Session management
│   │   ├── crypto/            # Encryption utilities
│   │   ├── types/             # TypeScript definitions
│   │   └── utils/             # Helper functions
│   ├── examples/              # Usage examples
│   ├── test/
│   └── package.json
│
├── docs/                       # Documentation
├── PRD.md                      # Product Requirements
├── TASKS.md                    # Development tasks
└── README.md                   # This file
```

## Quick Start

### For dApp Developers

```bash
npm install @nano-connect/sdk
```

```typescript
import NanoConnect from '@nano-connect/sdk';

// Initialize client
const client = new NanoConnect({
  relayUrl: 'wss://relay.nanoconnect.io',
  metadata: {
    name: 'My dApp',
    description: 'A Nano-powered application',
    url: 'https://mydapp.com',
    icons: ['https://mydapp.com/icon.png']
  }
});

// Create connection
const { uri, approval } = await client.connect({
  permissions: ['account_read', 'sign_block']
});

// Display QR code with URI
showQRCode(uri);

// Wait for approval
const session = await approval;
console.log('Connected accounts:', session.accounts);

// Request block signing
const signature = await client.signBlock({
  account: session.accounts[0],
  block: {...}
});
```

### For Wallet Developers

```typescript
import { NanoConnectWallet } from '@nano-connect/sdk';

// Initialize wallet client
const wallet = new NanoConnectWallet({
  relayUrl: 'wss://relay.nanoconnect.io',
  metadata: {
    name: 'My Nano Wallet',
    description: 'Secure Nano wallet',
    url: 'https://mywallet.com',
    icons: ['https://mywallet.com/icon.png']
  }
});

// Pair with dApp via URI (from QR scan)
await wallet.pair(uri);

// Listen for session proposals
wallet.on('session_proposal', async (proposal) => {
  // Show approval UI to user
  const approved = await showApprovalUI(proposal);

  if (approved) {
    await wallet.approveSession({
      id: proposal.id,
      accounts: ['nano_1abc...', 'nano_2def...']
    });
  } else {
    await wallet.rejectSession({
      id: proposal.id,
      reason: 'User rejected'
    });
  }
});

// Listen for signing requests
wallet.on('sign_request', async (request) => {
  const signature = await getUserSignature(request.block);
  await wallet.respondSignRequest({
    id: request.id,
    signature
  });
});
```

## API Methods

### dApp Client Methods
- `connect()` - Initiate connection with wallet
- `disconnect()` - End session
- `getAccounts()` - Get connected accounts
- `getAccountInfo(account)` - Get account balance and info
- `signBlock(params)` - Request block signature
- `getPending(account)` - Get pending blocks

### Wallet Client Methods
- `pair(uri)` - Pair with dApp via URI
- `approveSession(params)` - Approve connection
- `rejectSession(params)` - Reject connection
- `respondSignRequest(params)` - Respond to signing request
- `disconnect()` - End session

## Events

### dApp Events
- `session_approved` - Session approved by wallet
- `session_rejected` - Session rejected by wallet
- `session_deleted` - Session ended
- `sign_response` - Signature response received

### Wallet Events
- `session_proposal` - New session proposal received
- `sign_request` - Signing request received
- `session_deleted` - Session ended by dApp

## Development Roadmap

See [TASKS.md](./TASKS.md) for detailed development tasks.

**Phase 1: Foundation**
- Backend relay server setup
- Basic WebSocket relay
- Session management

**Phase 2: SDK Development**
- TypeScript SDK core
- QR code generation
- Encryption implementation

**Phase 3: Integration**
- End-to-end testing
- Example applications
- Documentation

**Phase 4: Production**
- Security audit
- Performance optimization
- Production deployment

## Security Considerations

1. **End-to-End Encryption**: All messages encrypted with session keys
2. **No Key Storage**: Relay server never sees private keys
3. **Session Expiry**: Automatic session timeout after inactivity
4. **Message TTL**: Old messages automatically purged
5. **JWT Validation**: All authenticated endpoints require valid JWT
6. **Rate Limiting**: Prevent spam and DoS attacks
7. **CORS Configuration**: Restrict relay access to authorized origins

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Discord: [Nano Discord](https://chat.nano.org)

## Acknowledgments

- Inspired by [WalletConnect](https://walletconnect.com/)
- Built for the [Nano](https://nano.org/) ecosystem
