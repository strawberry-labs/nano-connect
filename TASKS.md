# Nano Connect - Development Tasks

**Last Updated**: October 2025
**Version**: 1.0

---

## Task Status Legend

- ✅ **Completed** - Task finished and verified
- 🚧 **In Progress** - Currently being worked on
- ⏸️ **Blocked** - Waiting on dependency or decision
- ⏳ **Not Started** - Ready to begin

## Complexity Legend

- **Simple** - < 4 hours, straightforward implementation
- **Medium** - 1-3 days, moderate complexity
- **Complex** - 3+ days, requires design or multiple components

---

# PHASE 1: Backend Foundation (Weeks 1-4)

## 1.1 Project Setup & Infrastructure

### ✅ Task 1.1.1: Initialize NestJS Backend Project
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Bootstrap the NestJS backend application with TypeScript configuration.

**Acceptance Criteria**:
- [x] Run `nest new backend` with TypeScript template
- [x] Configure `tsconfig.json` with strict mode enabled
- [x] Set up ESLint with `@typescript-eslint` rules
- [x] Configure Prettier with consistent formatting rules
- [x] Add `.editorconfig` for cross-IDE consistency
- [x] Verify `npm run build` compiles successfully
- [x] Verify `npm run start:dev` runs in watch mode

**Dependencies**: None

---

### ✅ Task 1.1.2: Configure Environment Variables
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Set up configuration management with validation using `@nestjs/config`.

**Acceptance Criteria**:
- [x] Install `@nestjs/config` and `joi` for validation
- [x] Create `.env.example` with all required variables:
  - `NODE_ENV` (development/staging/production)
  - `PORT` (default: 3000)
  - `DATABASE_URL`
  - `REDIS_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRY`
  - `CORS_ORIGINS`
- [x] Create `config/configuration.ts` with type-safe config
- [x] Add Joi schema validation in `app.module.ts`
- [x] Application fails fast if required config is missing
- [x] Add `.env` to `.gitignore`

**Dependencies**: Task 1.1.1

---

### ✅ Task 1.1.3: Set Up PostgreSQL Database
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Configure PostgreSQL database connection and ORM setup.

**Acceptance Criteria**:
- [x] Install `@nestjs/typeorm`, `typeorm`, and `pg`
- [x] Configure TypeORM in `app.module.ts` with connection pooling
- [x] Set up separate configs for dev/staging/prod
- [x] Configure connection pool (min: 2, max: 20)
- [x] Enable query logging in development
- [x] Test database connection on app startup
- [x] Create initial migration setup with TypeORM CLI
- [x] Document database setup in `docs/database.md`

**Dependencies**: Task 1.1.2

---

### ✅ Task 1.1.4: Set Up Redis Cache
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 3 hours

**Description**: Configure Redis for session and message caching.

**Acceptance Criteria**:
- [x] Install `redis`
- [x] Create Redis module
- [x] Set default TTL to 24 hours for messages
- [x] Configure connection retry logic (max 3 retries)
- [x] Create `RedisService` wrapper for custom operations
- [x] Test Redis connection on app startup
- [x] Add health check for Redis connectivity
- [x] Document Redis usage patterns

**Dependencies**: Task 1.1.2

---

### 🚧 Task 1.1.5: Set Up Logging Infrastructure
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Implement structured logging with correlation IDs.

**Acceptance Criteria**:
- [x] Install `pino` for logging
- [x] Configure JSON log format for production
- [x] Configure pretty-print format for development
- [ ] Add request ID middleware (UUID v4)
- [ ] Include request ID in all log entries
- [ ] Configure log levels by environment
- [ ] Set up log rotation (daily, max 14 days)
- [ ] Create `LoggerService` wrapper
- [ ] Add error stack traces in development only

**Dependencies**: Task 1.1.2

---

## 1.2 Database Schema & Models

### ✅ Task 1.2.1: Design Database Schema
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Design and document the complete database schema.

**Acceptance Criteria**:
<!-- - [ ] Create ERD (Entity Relationship Diagram) with Draw.io | there's no relationships yet -->
- [x] Define `registered_apps` table with all fields
- [x] Document schema in `docs/database-schema.md`

**Dependencies**: Task 1.1.3

---

### ⏳ Task 1.2.2: Create Session Redis Schema
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Implement Redis data structures and operations for session management.

**Acceptance Criteria**:
- [x] Create `src/redis/session.schema.ts`
- [x] Define Redis key patterns for sessions (e.g., `session:{id}`)
- [ ] Implement session state enum (pending, active, completed, expired)
- [ ] Create methods for session CRUD operations using Redis hashes
- [ ] Add Redis indexing for session lookups by user/application
- [ ] Implement session expiration using Redis TTL
- [ ] Add methods to exclude sensitive fields from responses
- [ ] Add validation for session data structures
- [ ] Export service from module

**Dependencies**: Task 1.2.1

---

### ⏳ Task 1.2.3: Create Message Redis Schema
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Implement Redis data structures and operations for message management.

**Acceptance Criteria**:
- [x] Create `src/redis/message.schema.ts`
- [x] Define Redis key patterns for messages (e.g., `message:{id}`, `session:{sessionId}:messages`)
- [ ] Implement message type enum (request, response, error, system)
- [x] Use Redis hashes for message payload storage
- [ ] Add validation for message data structures
- [x] Implement automatic TTL expiration for messages
- [ ] Create helper methods for TTL calculation and validation
- [ ] Export service from module

**Dependencies**: Task 1.2.1

---

### ✅ Task 1.2.4: Generate Initial Migrations
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 1 hour

**Description**: Create TypeORM migrations for initial schema.

**Acceptance Criteria**:
- [x] Run `npm run typeorm migration:generate -- -n InitialSchema`
- [x] Review generated SQL for correctness
- [x] Test migration up: `npm run typeorm migration:run`
- [x] Test migration down: `npm run typeorm migration:revert`
- [x] Add migration scripts to `package.json`
- [x] Document migration workflow in MIGRATIONS.md

**Dependencies**: Tasks 1.2.2, 1.2.3

---

## 1.3 WebSocket Infrastructure

### 🚧 Task 1.3.1: Set Up WebSocket Gateway
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Implement WebSocket server using NestJS Gateway.

**Acceptance Criteria**:
- [x] Install `@nestjs/websockets`, `@nestjs/platform-socket.io`, `socket.io`
- [x] Create `src/relay/relay.gateway.ts`
- [x] Configure Socket.io with options:
  - CORS with allowed origins from env <!-- Sidenote: This should be configured to allow every origin as relay should be accessible from any domain -->
  - Transport: WebSocket only (no polling)
  - Path: `/relay`
  - Max message size: 100KB
- [ ] Implement connection lifecycle:
  - `handleConnection(client)` - log connection with client ID
  - `handleDisconnect(client)` - cleanup subscriptions
- [x] Store client connections in memory (Map<clientId, Socket>)
- [ ] Add connection rate limiting (max 10/minute per IP)
- [x] Emit `connected` event to client with server info
- [x] Log all connections/disconnections with timestamp

**Dependencies**: Task 1.1.2

---

### ⏳ Task 1.3.2: Implement Subscribe/Unsubscribe Logic
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Implement topic subscription mechanism.

**Acceptance Criteria**:
- [ ] Create subscription manager: `SubscriptionService`
- [ ] Store subscriptions: Map<topic, Set<clientId>>
- [ ] Implement `irn_subscribe` handler:
  - Validate topic format (UUID)
  - Add client to topic subscribers
  - Return subscription_id
  - Deliver any pending messages for topic
- [ ] Implement `irn_unsubscribe` handler:
  - Remove client from topic subscribers
  - Cleanup empty topics
  - Return success confirmation
- [ ] Auto-unsubscribe on client disconnect
- [ ] Add unit tests for subscription logic
- [ ] Log subscribe/unsubscribe events

**Dependencies**: Task 1.3.1

---

### ⏳ Task 1.3.3: Implement Publish/Subscribe Message Routing
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 8 hours

**Description**: Implement message publishing and routing to subscribers.

**Acceptance Criteria**:
- [ ] Implement `irn_publish` handler:
  - Validate message structure (ciphertext, iv, tag)
  - Check topic exists
  - Validate message size < 100KB
  - Generate message ID (UUID)
  - Store in database with TTL
- [ ] Route message to all topic subscribers:
  - Emit to each subscribed client
  - Track delivery status per client
  - Mark as delivered when acknowledged
- [ ] Store undelivered messages in Redis
- [ ] Implement message acknowledgment:
  - Client sends `irn_ack` with message_id
  - Mark message as delivered
- [ ] Add TTL-based cleanup job (every hour)
- [ ] Return publish response with message_id and delivery count
- [ ] Add integration tests for full publish flow

**Dependencies**: Task 1.3.2

---

### ⏳ Task 1.3.4: Implement Ping/Pong Keepalive
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 2 hours

**Description**: Implement keepalive mechanism to detect dead connections.

**Acceptance Criteria**:
- [ ] Implement `irn_ping` handler:
  - Update last_seen timestamp for client
  - Return `irn_pong` response
  - Include server timestamp
- [ ] Configure Socket.io built-in ping/pong (interval: 25s, timeout: 60s)
- [ ] Track last activity per client
- [ ] Auto-disconnect clients inactive > 5 minutes
- [ ] Log ping/pong in debug mode only
- [ ] Add health check using ping mechanism

**Dependencies**: Task 1.3.1

---

### ⏳ Task 1.3.5: Add Message Size and Rate Limiting
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Implement rate limiting and message size validation.

**Acceptance Criteria**:
- [ ] Install `@nestjs/throttler`
- [ ] Configure ThrottlerModule:
  - Global: 100 requests/minute per IP
  - Publish: 10 messages/minute per topic
  - Subscribe: 5 subscriptions/minute per client
- [ ] Validate message size before processing (max 100KB)
- [ ] Return error code 1005 (RATE_LIMIT_EXCEEDED) when hit
- [ ] Store rate limit counters in Redis
- [ ] Add bypass for authenticated admin connections
- [ ] Log rate limit violations
- [ ] Add tests for rate limiting

**Dependencies**: Task 1.3.3, Task 1.1.4

---

## 1.4 Session Management

### ⏳ Task 1.4.1: Create SessionService
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Implement session CRUD operations service.

**Acceptance Criteria**:
- [ ] Create `src/session/session.service.ts`
- [ ] Implement `createSession(dappMetadata, dappPublicKey)`:
  - Generate unique topic (UUID v4)
  - Set state to 'pending'
  - Set expires_at (7 days from now)
  - Save to database
  - Return session object
- [ ] Implement `getSessionByTopic(topic)`:
  - Query database by topic
  - Return null if not found or expired
- [ ] Implement `approveSession(topic, walletMetadata, walletPublicKey, accounts)`:
  - Update session with wallet data
  - Set state to 'active'
  - Update last_activity
  - Return updated session
- [ ] Implement `updateLastActivity(topic)`:
  - Set last_activity to current timestamp
- [ ] Implement `disconnectSession(topic)`:
  - Set state to 'disconnected'
  - Don't delete (keep for audit)
- [ ] Add unit tests with in-memory database

**Dependencies**: Task 1.2.2

---

### ⏳ Task 1.4.2: Implement Session Expiry Cleanup Job
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Create scheduled job to cleanup expired sessions.

**Acceptance Criteria**:
- [ ] Install `@nestjs/schedule`
- [ ] Create `SessionCleanupService`
- [ ] Implement cron job (runs every hour):
  - Query sessions where expires_at < now()
  - Update state to 'expired'
  - Delete messages older than TTL
  - Log cleanup results
- [ ] Add manual cleanup endpoint: `POST /admin/cleanup`
- [ ] Add dry-run mode for testing
- [ ] Log number of sessions cleaned
- [ ] Add metrics for cleanup operations
- [ ] Add unit tests with mocked time

**Dependencies**: Task 1.4.1

---

### ⏳ Task 1.4.3: Implement Session State Machine
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 5 hours

**Description**: Enforce valid session state transitions.

**Acceptance Criteria**:
- [ ] Create `SessionStateMachine` class
- [ ] Define valid transitions:
  - pending → active (on approval)
  - pending → disconnected (on rejection)
  - active → disconnected (on disconnect)
  - active → expired (on TTL)
  - pending → expired (on TTL)
- [ ] Throw error on invalid transition
- [ ] Add transition logging
- [ ] Emit events on state changes:
  - `session.approved`
  - `session.rejected`
  - `session.disconnected`
  - `session.expired`
- [ ] Add unit tests for all transitions
- [ ] Document state machine in README

**Dependencies**: Task 1.4.1

---

## 1.5 Authentication & Security

### ⏳ Task 1.5.1: Implement JWT Authentication
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Set up JWT-based authentication for sessions.

**Acceptance Criteria**:
- [ ] Install `@nestjs/jwt` and `@nestjs/passport`
- [ ] Create `AuthModule` with JWT strategy
- [ ] Generate JWT on session approval:
  - Payload: { topic, accounts, iat, exp }
  - Sign with RS256 (generate key pair)
  - Expiry: 7 days (same as session)
- [ ] Create `JwtAuthGuard` using `@nestjs/passport`
- [ ] Implement JWT validation:
  - Verify signature
  - Check expiry
  - Verify session still active
- [ ] Add `@UseGuards(JwtAuthGuard)` to protected endpoints
- [ ] Return 401 Unauthorized on invalid token
- [ ] Add unit tests for auth flow

**Dependencies**: Task 1.4.1

---

### ⏳ Task 1.5.2: Generate and Store RSA Key Pair
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Generate RSA keys for JWT signing.

**Acceptance Criteria**:
- [ ] Generate RSA-256 key pair on first startup
- [ ] Store private key in environment or secrets manager
- [ ] Store public key in environment (can be public)
- [ ] Add key rotation support (store key ID in JWT)
- [ ] Export public key via `GET /auth/public-key` endpoint
- [ ] Document key generation in deployment docs
- [ ] Add script: `npm run generate-keys`

**Dependencies**: None

---

### ⏳ Task 1.5.3: Implement CORS Configuration
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Configure CORS for REST API and WebSocket.

**Acceptance Criteria**:
- [ ] Configure CORS in `main.ts`:
  - Origins from `CORS_ORIGINS` env variable (comma-separated)
  - Allow credentials: true
  - Allow methods: GET, POST, OPTIONS
  - Allow headers: Content-Type, Authorization
- [ ] Configure Socket.io CORS with same origins
- [ ] Support wildcard for development (log warning)
- [ ] Add preflight request handling
- [ ] Test with browser fetch from allowed origin
- [ ] Test rejection from disallowed origin
- [ ] Document CORS setup in deployment guide

**Dependencies**: Task 1.1.2

---

### ⏳ Task 1.5.4: Add Security Headers
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 2 hours

**Description**: Add security headers using Helmet.

**Acceptance Criteria**:
- [ ] Install `helmet` package
- [ ] Configure Helmet middleware in `main.ts`:
  - Content Security Policy
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security (HSTS)
- [ ] Configure for WebSocket compatibility
- [ ] Test headers with curl or Postman
- [ ] Document security headers in README

**Dependencies**: None

---

## 1.6 REST API Endpoints

### ⏳ Task 1.6.1: Create Health Check Endpoint
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Implement `GET /health` endpoint.

**Acceptance Criteria**:
- [ ] Install `@nestjs/terminus`
- [ ] Create `HealthController`
- [ ] Implement `GET /health`:
  - Check database connection
  - Check Redis connection
  - Return 200 OK if healthy, 503 if not
  - Return JSON: `{ status, version, uptime, connections }`
- [ ] Add separate `GET /health/liveness` (always 200)
- [ ] Add separate `GET /health/readiness` (checks dependencies)
- [ ] Add unit tests
- [ ] Document endpoint in OpenAPI/Swagger

**Dependencies**: Tasks 1.1.3, 1.1.4

---

### ⏳ Task 1.6.2: Create Session Info Endpoint
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Implement `GET /session/:topic` endpoint.

**Acceptance Criteria**:
- [ ] Create `SessionController`
- [ ] Implement `GET /session/:topic`:
  - Query session by topic
  - Return 404 if not found
  - Return public fields only (no keys)
  - Fields: topic, state, created_at, expires_at
- [ ] Add input validation for topic format
- [ ] Add rate limiting (100 requests/minute)
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Document in OpenAPI/Swagger

**Dependencies**: Task 1.4.1

---

### ⏳ Task 1.6.3: Create Relay Info Endpoint
**Complexity**: Simple
**Priority**: P2 (Low)
**Estimated Time**: 2 hours

**Description**: Implement `GET /info` endpoint.

**Acceptance Criteria**:
- [ ] Create `InfoController`
- [ ] Implement `GET /info`:
  - Return protocol name: "nano-connect"
  - Return version from package.json
  - Return supported features array
  - Return max message size
- [ ] Add caching (1 hour TTL)
- [ ] Add unit tests
- [ ] Document in OpenAPI/Swagger

**Dependencies**: None

---

### ⏳ Task 1.6.4: Set Up OpenAPI/Swagger Documentation
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Generate interactive API documentation.

**Acceptance Criteria**:
- [ ] Install `@nestjs/swagger`
- [ ] Configure SwaggerModule in `main.ts`
- [ ] Add `@ApiTags()` to all controllers
- [ ] Add `@ApiOperation()` to all endpoints
- [ ] Add `@ApiResponse()` for all status codes
- [ ] Add DTO decorators: `@ApiProperty()`
- [ ] Serve docs at `/api/docs`
- [ ] Test interactive API in browser
- [ ] Add authentication to Swagger UI

**Dependencies**: Tasks 1.6.1, 1.6.2, 1.6.3

---

## 1.7 Error Handling & Validation

### ⏳ Task 1.7.1: Create Custom Exception Filters
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Implement global exception handling.

**Acceptance Criteria**:
- [ ] Create `AllExceptionsFilter` implementing `ExceptionFilter`
- [ ] Catch all errors and format as JSON:
  ```json
  {
    "statusCode": 500,
    "code": "INTERNAL_ERROR",
    "message": "...",
    "timestamp": "...",
    "path": "/api/..."
  }
  ```
- [ ] Map common errors to HTTP status codes:
  - ValidationError → 400
  - UnauthorizedException → 401
  - NotFoundException → 404
  - InternalServerError → 500
- [ ] Log all errors with stack traces
- [ ] Hide sensitive info in production
- [ ] Register globally with `app.useGlobalFilters()`
- [ ] Add unit tests

**Dependencies**: Task 1.1.5

---

### ⏳ Task 1.7.2: Define Error Code Enums
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 2 hours

**Description**: Create error code constants for all error types.

**Acceptance Criteria**:
- [ ] Create `src/common/errors/error-codes.enum.ts`
- [ ] Define error codes from PRD section 8.1:
  - 1000: UNAUTHORIZED
  - 1001: SESSION_NOT_FOUND
  - 1002: SESSION_EXPIRED
  - 1003: INVALID_MESSAGE
  - 1004: ENCRYPTION_ERROR
  - 1005: RATE_LIMIT_EXCEEDED
  - 2000: USER_REJECTED
  - 2001: INVALID_PARAMS
  - 3000: INTERNAL_ERROR
  - 3001: RELAY_ERROR
- [ ] Create `CustomException` class extending HttpException
- [ ] Export error code type for TypeScript
- [ ] Document error codes in README

**Dependencies**: None

---

### ⏳ Task 1.7.3: Set Up Request Validation
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 3 hours

**Description**: Enable automatic request validation with DTOs.

**Acceptance Criteria**:
- [ ] Install `class-validator` and `class-transformer`
- [ ] Enable global validation pipe in `main.ts`:
  ```typescript
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  ```
- [ ] Create DTOs for all endpoints:
  - `CreateSessionDto`
  - `ApproveSessionDto`
  - `PublishMessageDto`
  - `SubscribeDto`
- [ ] Add validation decorators to DTOs
- [ ] Test validation errors return 400
- [ ] Add unit tests for each DTO

**Dependencies**: Task 1.6.1

---

---

# PHASE 2: TypeScript SDK Core (Weeks 5-8)

## 2.1 SDK Project Setup

### ⏳ Task 2.1.1: Initialize SDK Project Structure
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Set up SDK monorepo or package structure.

**Acceptance Criteria**:
- [ ] Create `sdk/` directory in project root
- [ ] Run `npm init` and configure package.json:
  - Name: `@nano-connect/sdk`
  - Version: 0.1.0
  - Type: module (ESM)
  - Exports: dApp client, wallet client, types
- [ ] Initialize TypeScript: `npx tsc --init`
- [ ] Configure `tsconfig.json`:
  - Target: ES2020
  - Module: ESNext
  - Declaration: true (generate .d.ts)
  - Source maps: true
- [ ] Set up folder structure:
  ```
  sdk/
  ├── src/
  │   ├── client/        # dApp client
  │   ├── wallet/        # Wallet client
  │   ├── crypto/        # Encryption
  │   ├── types/         # TypeScript types
  │   └── utils/         # Helpers
  ├── examples/
  ├── test/
  └── package.json
  ```
- [ ] Add ESLint + Prettier configuration
- [ ] Add `.gitignore`

**Dependencies**: None

---

### ⏳ Task 2.1.2: Configure Build System
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 5 hours

**Description**: Set up bundling with Rollup or Vite for multiple output formats.

**Acceptance Criteria**:
- [ ] Install `rollup` or `vite` for bundling
- [ ] Configure build to output:
  - ESM (ES modules) for modern bundlers
  - CJS (CommonJS) for Node.js
  - UMD (Universal) for browser <script> tags
  - TypeScript declarations (.d.ts)
- [ ] Configure tree-shaking for minimal bundle size
- [ ] Add source maps for debugging
- [ ] Target bundle size < 50KB gzipped
- [ ] Add build scripts to package.json:
  - `npm run build` - Full build
  - `npm run build:watch` - Watch mode
- [ ] Test build outputs work in Node.js and browser
- [ ] Add bundle size check in CI

**Dependencies**: Task 2.1.1

---

### ⏳ Task 2.1.3: Set Up Testing Framework
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 3 hours

**Description**: Configure Jest for unit and integration tests.

**Acceptance Criteria**:
- [ ] Install `jest`, `@types/jest`, `ts-jest`
- [ ] Configure `jest.config.js`:
  - Preset: ts-jest
  - Test environment: node
  - Coverage threshold: 80%
  - Collect coverage from src/**/*.ts
- [ ] Add test scripts to package.json:
  - `npm test` - Run all tests
  - `npm run test:watch` - Watch mode
  - `npm run test:coverage` - Generate coverage report
- [ ] Create sample test to verify setup
- [ ] Configure test file naming: `*.test.ts` or `*.spec.ts`
- [ ] Add coverage reports to `.gitignore`

**Dependencies**: Task 2.1.1

---

### ⏳ Task 2.1.4: Create TypeScript Type Definitions
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Define all TypeScript interfaces and types.

**Acceptance Criteria**:
- [ ] Create `src/types/index.ts` with all types from PRD section 6
- [ ] Define core types:
  ```typescript
  interface Session {
    topic: string;
    dappPublicKey: string;
    walletPublicKey: string | null;
    accounts: string[];
    permissions: Permission[];
    dappMetadata: AppMetadata;
    walletMetadata: AppMetadata | null;
    state: SessionState;
    createdAt: number;
    expiresAt: number;
  }

  interface AppMetadata {
    name: string;
    description: string;
    url: string;
    icons: string[];
  }

  interface ConnectParams {
    permissions: Permission[];
    metadata?: AppMetadata;
  }

  interface ConnectResult {
    uri: string;
    approval: Promise<Session>;
  }
  ```
- [ ] Define Nano-specific types:
  ```typescript
  interface NanoSignBlockParams {
    account: string;
    block: NanoBlock;
  }

  interface NanoBlock {
    type: 'state';
    account: string;
    previous: string;
    representative: string;
    balance: string;
    link: string;
  }

  interface NanoAccountInfo {
    account: string;
    balance: string;
    blockCount: number;
    representative: string;
  }
  ```
- [ ] Define WebSocket message types:
  ```typescript
  interface RelayMessage {
    id: string;
    topic: string;
    type: 'request' | 'response' | 'event';
    payload: EncryptedPayload;
  }

  interface JSONRPCRequest {
    id: number;
    jsonrpc: '2.0';
    method: string;
    params: any;
  }
  ```
- [ ] Export all types
- [ ] Add JSDoc comments for all types
- [ ] Validate types compile without errors

**Dependencies**: Task 2.1.1

---

## 2.2 WebSocket Connection Manager

### ⏳ Task 2.2.1: Create WebSocket Client Wrapper
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Create abstraction over WebSocket connection.

**Acceptance Criteria**:
- [ ] Create `src/utils/websocket-client.ts`
- [ ] Install `socket.io-client` for WebSocket
- [ ] Implement `WebSocketClient` class:
  - Constructor accepts relay URL
  - `connect()` method establishes connection
  - `disconnect()` method closes connection
  - `send(message)` sends JSON-RPC message
  - `on(event, handler)` registers event listeners
- [ ] Implement connection states: disconnected, connecting, connected, error
- [ ] Emit events: `open`, `close`, `error`, `message`
- [ ] Add connection timeout (10 seconds)
- [ ] Support custom headers (for auth)
- [ ] Add unit tests with mock WebSocket
- [ ] Handle connection errors gracefully

**Dependencies**: Task 2.1.1

---

### ⏳ Task 2.2.2: Implement Automatic Reconnection
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 5 hours

**Description**: Add automatic reconnection with exponential backoff.

**Acceptance Criteria**:
- [ ] Detect connection loss (close event, error, timeout)
- [ ] Implement exponential backoff:
  - Initial delay: 1 second
  - Max delay: 30 seconds
  - Backoff multiplier: 2
  - Jitter: ±25%
- [ ] Max reconnection attempts: 10
- [ ] Resubscribe to topics after reconnect
- [ ] Emit `reconnecting` and `reconnected` events
- [ ] Allow manual reconnection override
- [ ] Add configuration options for backoff
- [ ] Add unit tests with simulated disconnects
- [ ] Log reconnection attempts

**Dependencies**: Task 2.2.1

---

### ⏳ Task 2.2.3: Implement Request/Response Correlation
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 5 hours

**Description**: Track request IDs to match responses.

**Acceptance Criteria**:
- [ ] Create `RequestManager` class
- [ ] Store pending requests: `Map<requestId, { resolve, reject, timeout }>`
- [ ] Auto-increment request ID for each request
- [ ] Implement `sendRequest(method, params)`:
  - Generate unique request ID
  - Create promise with resolve/reject
  - Set timeout (default 30 seconds)
  - Send JSON-RPC request
  - Return promise
- [ ] Handle response matching:
  - Match response.id to pending request
  - Resolve promise with result
  - Reject promise with error
- [ ] Handle request timeout:
  - Reject promise after timeout
  - Cleanup pending request
- [ ] Add unit tests for success, error, timeout cases

**Dependencies**: Task 2.2.1

---

## 2.3 Cryptography Implementation

### ⏳ Task 2.3.1: Implement Key Generation
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Generate X25519 keypairs for encryption.

**Acceptance Criteria**:
- [ ] Install `tweetnacl` or `@noble/curves` for X25519
- [ ] Create `src/crypto/keys.ts`
- [ ] Implement `generateKeyPair()`:
  - Generate random 32-byte private key
  - Derive public key using X25519
  - Return { privateKey, publicKey } as hex strings
- [ ] Implement `exportKeyPair(keypair, format)`:
  - Support 'hex' and 'base64' formats
- [ ] Implement `importKeyPair(data, format)`:
  - Parse hex or base64
  - Validate key lengths
- [ ] Use `crypto.getRandomValues()` for entropy
- [ ] Add unit tests for key generation
- [ ] Verify keys work with X25519

**Dependencies**: Task 2.1.1

---

### ⏳ Task 2.3.2: Implement Shared Secret Derivation
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Derive shared secrets using ECDH.

**Acceptance Criteria**:
- [ ] Create `src/crypto/ecdh.ts`
- [ ] Implement `deriveSharedSecret(myPrivateKey, theirPublicKey)`:
  - Use X25519 key agreement
  - Return 32-byte shared secret
- [ ] Implement HKDF for key derivation:
  - Use SHA-256
  - Derive symmetric key from shared secret
  - Use salt and info parameters
- [ ] Return derived key as Uint8Array
- [ ] Add unit tests:
  - Verify same secret derived on both sides
  - Test with known test vectors
- [ ] Handle invalid key inputs

**Dependencies**: Task 2.3.1

---

### ⏳ Task 2.3.3: Implement Message Encryption
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 5 hours

**Description**: Encrypt messages with ChaCha20-Poly1305 or AES-GCM.

**Acceptance Criteria**:
- [ ] Create `src/crypto/encryption.ts`
- [ ] Choose algorithm: ChaCha20-Poly1305 (preferred) or AES-256-GCM
- [ ] Install `tweetnacl-util` or use WebCrypto API
- [ ] Implement `encrypt(message, symmetricKey)`:
  - Generate random nonce/IV (12 bytes)
  - Encrypt plaintext with symmetric key
  - Return { ciphertext, iv, tag } (all base64)
- [ ] Support string and Uint8Array inputs
- [ ] Add unit tests:
  - Encrypt and decrypt round-trip
  - Verify authentication tag
- [ ] Handle encryption errors gracefully

**Dependencies**: Task 2.3.2

---

### ⏳ Task 2.3.4: Implement Message Decryption
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Decrypt encrypted messages and verify integrity.

**Acceptance Criteria**:
- [ ] Implement `decrypt(ciphertext, iv, tag, symmetricKey)`:
  - Parse base64 inputs
  - Decrypt with symmetric key
  - Verify authentication tag
  - Return plaintext string
- [ ] Throw `ENCRYPTION_ERROR` if:
  - Tag verification fails
  - Invalid ciphertext
  - Wrong key
- [ ] Support Uint8Array and string outputs
- [ ] Add unit tests:
  - Valid decryption
  - Invalid tag (should fail)
  - Wrong key (should fail)
- [ ] Log decryption errors (not contents)

**Dependencies**: Task 2.3.3

---

### ⏳ Task 2.3.5: Create Crypto Utilities
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Helper functions for encoding, hashing, etc.

**Acceptance Criteria**:
- [ ] Create `src/crypto/utils.ts`
- [ ] Implement `hexToBytes(hex)` and `bytesToHex(bytes)`
- [ ] Implement `base64ToBytes(b64)` and `bytesToBase64(bytes)`
- [ ] Implement `sha256(data)` hash function
- [ ] Implement `generateRandomBytes(length)`
- [ ] Implement `generateUUID()` for message IDs
- [ ] Add input validation for all functions
- [ ] Add unit tests for all utilities
- [ ] Export from `src/crypto/index.ts`

**Dependencies**: None

---

## 2.4 dApp Client Implementation

### ⏳ Task 2.4.1: Create NanoConnect Client Class
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 8 hours

**Description**: Main dApp client class implementation.

**Acceptance Criteria**:
- [ ] Create `src/client/nano-connect-client.ts`
- [ ] Implement class structure:
  ```typescript
  export class NanoConnect {
    constructor(config: NanoConnectConfig);
    async connect(params: ConnectParams): Promise<ConnectResult>;
    async disconnect(): Promise<void>;
    async signBlock(params: NanoSignBlockParams): Promise<string>;
    async getAccountInfo(account: string): Promise<NanoAccountInfo>;
    async getPending(account: string): Promise<NanoPendingBlock[]>;
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
  }
  ```
- [ ] Initialize WebSocket connection in constructor
- [ ] Store session state (topic, keys, accounts)
- [ ] Implement EventEmitter for events
- [ ] Add connection status tracking
- [ ] Validate config on initialization
- [ ] Add JSDoc comments for all methods
- [ ] Export from `src/index.ts`

**Dependencies**: Tasks 2.2.1, 2.1.4

---

### ⏳ Task 2.4.2: Implement Connect Method
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 8 hours

**Description**: Implement session connection flow.

**Acceptance Criteria**:
- [ ] Implement `connect()` method:
  1. Generate X25519 keypair
  2. Generate unique topic (UUID)
  3. Format connection URI:
     `nanoconnect:${topic}@${version}?relay=${relayUrl}&key=${publicKey}`
  4. Subscribe to session topic via WebSocket
  5. Create approval promise that resolves on session_approved
  6. Return { uri, approval }
- [ ] Listen for `session_proposal` response:
  - Extract wallet public key
  - Derive shared secret
  - Store session data
  - Resolve approval promise
- [ ] Handle session rejection:
  - Reject approval promise with error
  - Cleanup resources
- [ ] Add timeout (2 minutes)
- [ ] Add unit tests with mocked relay
- [ ] Add integration test with real relay

**Dependencies**: Tasks 2.4.1, 2.3.1, 2.3.2

---

### ⏳ Task 2.4.3: Implement Disconnect Method
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 3 hours

**Description**: Gracefully disconnect session.

**Acceptance Criteria**:
- [ ] Implement `disconnect()` method:
  - Send `session_delete` message to wallet
  - Unsubscribe from session topic
  - Clear session state
  - Emit `session_deleted` event
- [ ] Handle already disconnected state
- [ ] Cleanup pending requests
- [ ] Close WebSocket if no other sessions
- [ ] Add unit tests
- [ ] Handle errors gracefully

**Dependencies**: Task 2.4.1

---

### ⏳ Task 2.4.4: Implement Sign Block Method
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Request block signature from wallet.

**Acceptance Criteria**:
- [ ] Implement `signBlock({ account, block })` method:
  - Validate account is connected
  - Validate block structure
  - Create JSON-RPC request:
    ```json
    {
      "id": 1,
      "jsonrpc": "2.0",
      "method": "nano_signBlock",
      "params": { "account": "...", "block": {...} }
    }
    ```
  - Encrypt request with session key
  - Publish to session topic
  - Wait for response (timeout: 2 minutes)
- [ ] Handle response:
  - Decrypt response
  - Extract signature
  - Return signature string
- [ ] Handle errors:
  - User rejection (code 2000)
  - Invalid block (code 2001)
  - Timeout
- [ ] Add unit tests with mock wallet
- [ ] Add integration test

**Dependencies**: Tasks 2.4.1, 2.3.3, 2.3.4

---

### ⏳ Task 2.4.5: Implement Get Account Info Method
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Request account info from wallet.

**Acceptance Criteria**:
- [ ] Implement `getAccountInfo(account)` method:
  - Validate account format (starts with `nano_`)
  - Create JSON-RPC request:
    ```json
    {
      "method": "nano_accountInfo",
      "params": { "account": "nano_..." }
    }
    ```
  - Encrypt and publish request
  - Wait for response
  - Decrypt and return account info
- [ ] Return type: `NanoAccountInfo`
- [ ] Handle account not found error
- [ ] Add caching (optional, 30 seconds)
- [ ] Add unit tests

**Dependencies**: Task 2.4.1

---

### ⏳ Task 2.4.6: Implement Get Pending Blocks Method
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Request pending (receivable) blocks.

**Acceptance Criteria**:
- [ ] Implement `getPending(account, threshold?)` method:
  - Validate account format
  - Create JSON-RPC request:
    ```json
    {
      "method": "nano_pending",
      "params": { "account": "nano_...", "threshold": "1000000..." }
    }
    ```
  - Encrypt and publish
  - Decrypt response
  - Return array of pending blocks
- [ ] Optional threshold parameter (minimum amount)
- [ ] Return type: `NanoPendingBlock[]`
- [ ] Handle no pending blocks (return empty array)
- [ ] Add unit tests

**Dependencies**: Task 2.4.1

---

### ⏳ Task 2.4.7: Implement Event System
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 5 hours

**Description**: Event emitter for dApp client.

**Acceptance Criteria**:
- [ ] Use EventEmitter pattern (Node.js events or custom)
- [ ] Implement `on(event, handler)`:
  - Register event listener
  - Return unsubscribe function
- [ ] Implement `once(event, handler)`:
  - Auto-remove after first call
- [ ] Implement `off(event, handler)`:
  - Remove specific listener
- [ ] Emit events:
  - `session_approved` - Session approved by wallet
  - `session_rejected` - Session rejected
  - `session_deleted` - Session disconnected
  - `error` - Any error
- [ ] Type-safe event handlers with generics
- [ ] Add unit tests for all event methods

**Dependencies**: Task 2.4.1

---

## 2.5 Wallet Client Implementation

### ⏳ Task 2.5.1: Create NanoConnectWallet Client Class
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 8 hours

**Description**: Main wallet client class implementation.

**Acceptance Criteria**:
- [ ] Create `src/wallet/nano-connect-wallet.ts`
- [ ] Implement class structure:
  ```typescript
  export class NanoConnectWallet {
    constructor(config: WalletConfig);
    async pair(uri: string): Promise<void>;
    async approveSession(params: ApproveParams): Promise<void>;
    async rejectSession(params: RejectParams): Promise<void>;
    async respondSignRequest(params: RespondParams): Promise<void>;
    async disconnect(topic: string): Promise<void>;
    on(event: string, handler: Function): void;
    off(event: string, handler: Function): void;
  }
  ```
- [ ] Initialize WebSocket connection
- [ ] Track multiple sessions (Map<topic, Session>)
- [ ] Implement EventEmitter
- [ ] Add JSDoc comments
- [ ] Export from `src/index.ts`

**Dependencies**: Task 2.2.1

---

### ⏳ Task 2.5.2: Implement URI Parsing
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 3 hours

**Description**: Parse connection URI from QR code.

**Acceptance Criteria**:
- [ ] Create `src/utils/uri-parser.ts`
- [ ] Implement `parseURI(uri)` function:
  - Format: `nanoconnect:topic@version?relay=url&key=publickey`
  - Extract topic, version, relay URL, public key
  - Validate format
  - Return parsed object
- [ ] Handle malformed URIs:
  - Missing parts
  - Invalid format
  - Invalid keys
- [ ] Return type: `ParsedURI`
- [ ] Add unit tests with valid and invalid URIs

**Dependencies**: None

---

### ⏳ Task 2.5.3: Implement Pair Method
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Pair with dApp via scanned URI.

**Acceptance Criteria**:
- [ ] Implement `pair(uri)` method:
  1. Parse URI to extract topic, relay, dapp public key
  2. Connect to relay (if not connected)
  3. Subscribe to session topic
  4. Generate wallet keypair
  5. Derive shared secret with dapp key
  6. Store session (state: pending)
  7. Listen for session requests
- [ ] Emit `session_proposal` event with proposal data
- [ ] Handle connection errors
- [ ] Add timeout (30 seconds)
- [ ] Add unit tests with mock relay
- [ ] Add integration test

**Dependencies**: Tasks 2.5.1, 2.5.2, 2.3.1, 2.3.2

---

### ⏳ Task 2.5.4: Implement Approve Session Method
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Approve session and send wallet data.

**Acceptance Criteria**:
- [ ] Implement `approveSession({ id, accounts, metadata })` method:
  - Validate accounts are Nano addresses
  - Create JSON-RPC response:
    ```json
    {
      "id": 1,
      "jsonrpc": "2.0",
      "result": {
        "accounts": ["nano_..."],
        "publicKey": "...",
        "metadata": {...}
      }
    }
    ```
  - Encrypt response with session key
  - Publish to topic
  - Update session state to 'active'
- [ ] Emit `session_approved` event
- [ ] Add unit tests

**Dependencies**: Task 2.5.3

---

### ⏳ Task 2.5.5: Implement Reject Session Method
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 3 hours

**Description**: Reject session proposal.

**Acceptance Criteria**:
- [ ] Implement `rejectSession({ id, reason })` method:
  - Create JSON-RPC error response:
    ```json
    {
      "id": 1,
      "jsonrpc": "2.0",
      "error": {
        "code": 2000,
        "message": "User rejected"
      }
    }
    ```
  - Encrypt and publish
  - Cleanup session
  - Unsubscribe from topic
- [ ] Emit `session_rejected` event
- [ ] Add unit tests

**Dependencies**: Task 2.5.3

---

### ⏳ Task 2.5.6: Implement Sign Request Handler
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 6 hours

**Description**: Handle incoming sign requests from dApp.

**Acceptance Criteria**:
- [ ] Listen for `nano_signBlock` requests on active sessions
- [ ] Decrypt incoming request
- [ ] Validate block structure
- [ ] Emit `sign_request` event with:
  ```typescript
  {
    id: number;
    account: string;
    block: NanoBlock;
    respondWith: (signature: string) => Promise<void>;
  }
  ```
- [ ] Implement `respondSignRequest({ id, signature })`:
  - Create response with signature
  - Encrypt and publish
- [ ] Handle rejection:
  - Send error response (code 2000)
- [ ] Add unit tests with mock signing

**Dependencies**: Task 2.5.4

---

### ⏳ Task 2.5.7: Implement Account Info Handler
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 5 hours

**Description**: Handle account info requests.

**Acceptance Criteria**:
- [ ] Listen for `nano_accountInfo` requests
- [ ] Query local Nano node or RPC endpoint
- [ ] Format response as `NanoAccountInfo`
- [ ] Encrypt and send response
- [ ] Handle account not found errors
- [ ] Add caching for repeated requests
- [ ] Add unit tests with mock RPC

**Dependencies**: Task 2.5.4

---

### ⏳ Task 2.5.8: Implement Event System
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Event emitter for wallet client.

**Acceptance Criteria**:
- [ ] Use EventEmitter pattern
- [ ] Implement `on()`, `once()`, `off()` methods
- [ ] Emit events:
  - `session_proposal` - New connection request
  - `sign_request` - Sign block request
  - `account_info_request` - Account info request
  - `session_deleted` - dApp disconnected
  - `error` - Any error
- [ ] Type-safe handlers
- [ ] Add unit tests

**Dependencies**: Task 2.5.1

---

## 2.6 Utilities & Helpers

### ⏳ Task 2.6.1: Implement QR Code Generation
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Generate QR codes for connection URIs.

**Acceptance Criteria**:
- [ ] Install `qrcode` package
- [ ] Create `src/utils/qr-code.ts`
- [ ] Implement `generateQRCode(uri, options?)`:
  - Generate QR code as data URL
  - Support size configuration
  - Support error correction level
  - Return base64 data URL
- [ ] Implement `generateQRCodeSVG(uri)`:
  - Return SVG string for better scaling
- [ ] Add unit tests
- [ ] Document usage in README

**Dependencies**: None

---

### ⏳ Task 2.6.2: Implement Deep Link Utilities
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Generate deep links for mobile wallets.

**Acceptance Criteria**:
- [ ] Create `src/utils/deep-link.ts`
- [ ] Implement `generateDeepLink(uri, walletScheme?)`:
  - Format: `nanoconnect://connect?uri=${encodedUri}`
  - Support custom wallet schemes
  - URL encode parameters
- [ ] Implement `openDeepLink(deepLink)`:
  - Open in new window/tab
  - Handle mobile redirect
- [ ] Detect mobile OS (iOS/Android)
- [ ] Support universal links fallback
- [ ] Add unit tests

**Dependencies**: None

---

### ⏳ Task 2.6.3: Create Storage Adapter Interface
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 5 hours

**Description**: Abstract storage for sessions and keys.

**Acceptance Criteria**:
- [ ] Create `src/storage/storage-adapter.ts`
- [ ] Define interface:
  ```typescript
  interface StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): Promise<void>;
  }
  ```
- [ ] Implement `LocalStorageAdapter` (browser)
- [ ] Implement `AsyncStorageAdapter` (React Native)
- [ ] Implement `MemoryStorageAdapter` (fallback)
- [ ] Auto-detect best adapter
- [ ] Add unit tests for each adapter

**Dependencies**: None

---

### ⏳ Task 2.6.4: Implement Session Persistence
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 5 hours

**Description**: Save and restore sessions from storage.

**Acceptance Criteria**:
- [ ] Store session data on approval:
  - Topic
  - Keys (encrypted if possible)
  - Accounts
  - Expiry
- [ ] Restore sessions on SDK initialization:
  - Load from storage
  - Validate not expired
  - Reconnect to relay
  - Resubscribe to topics
- [ ] Clear sessions on disconnect
- [ ] Clear expired sessions automatically
- [ ] Add `clearAllSessions()` method
- [ ] Add unit tests

**Dependencies**: Task 2.6.3

---

### ⏳ Task 2.6.5: Create Validation Helpers
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Input validation utilities.

**Acceptance Criteria**:
- [ ] Create `src/utils/validators.ts`
- [ ] Implement `validateNanoAddress(address)`:
  - Check format: `nano_` prefix
  - Validate length (65 chars)
  - Validate checksum
  - Return boolean
- [ ] Implement `validateTopic(topic)`:
  - Check UUID format
- [ ] Implement `validateBlock(block)`:
  - Check required fields
  - Validate field types
- [ ] Implement `validateURI(uri)`:
  - Check format
- [ ] Add unit tests for all validators

**Dependencies**: None

---

### ⏳ Task 2.6.6: Create Error Classes
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Custom error types for SDK.

**Acceptance Criteria**:
- [ ] Create `src/errors/index.ts`
- [ ] Define error classes:
  ```typescript
  class NanoConnectError extends Error {
    code: number;
    constructor(code: number, message: string);
  }

  class SessionExpiredError extends NanoConnectError {}
  class EncryptionError extends NanoConnectError {}
  class UserRejectedError extends NanoConnectError {}
  class TimeoutError extends NanoConnectError {}
  class InvalidParamsError extends NanoConnectError {}
  ```
- [ ] Map error codes to classes
- [ ] Add `toJSON()` for serialization
- [ ] Export all error classes
- [ ] Document error handling in README

**Dependencies**: None

---

---

# PHASE 3: Integration & Features (Weeks 9-12)

## 3.1 End-to-End Integration

### ⏳ Task 3.1.1: Create Integration Test Suite
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 10 hours

**Description**: Full flow tests with real backend and SDK.

**Acceptance Criteria**:
- [ ] Set up test environment with Docker Compose:
  - PostgreSQL container
  - Redis container
  - Backend server
- [ ] Create test scenarios:
  - Complete connection flow
  - Block signing flow
  - Account info retrieval
  - Session disconnection
  - Session expiry
  - Concurrent sessions
- [ ] Use real WebSocket connections
- [ ] Use real encryption
- [ ] Test with both dApp and wallet clients
- [ ] Measure end-to-end latency
- [ ] Add test cleanup (clear DB between tests)
- [ ] Document test setup in README

**Dependencies**: All Phase 1 and Phase 2 tasks

---

### ⏳ Task 3.1.2: Test Message Encryption End-to-End
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Verify encryption works between clients.

**Acceptance Criteria**:
- [ ] Create test with dApp and wallet clients
- [ ] dApp generates keypair
- [ ] Wallet generates keypair
- [ ] Both derive same shared secret
- [ ] dApp encrypts message
- [ ] Wallet decrypts successfully
- [ ] Verify message integrity (auth tag)
- [ ] Test with invalid keys (should fail)
- [ ] Test with tampered ciphertext (should fail)
- [ ] Document encryption flow

**Dependencies**: Phase 2 crypto tasks

---

### ⏳ Task 3.1.3: Test Reconnection Scenarios
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Test automatic reconnection handling.

**Acceptance Criteria**:
- [ ] Test scenarios:
  - Network loss during active session
  - Server restart during session
  - Client goes offline and comes back
  - Multiple reconnection attempts
- [ ] Verify pending messages delivered after reconnect
- [ ] Verify subscriptions restored
- [ ] Verify session state maintained
- [ ] Test max reconnection attempts
- [ ] Add logs for debugging
- [ ] Document reconnection behavior

**Dependencies**: Task 2.2.2

---

### ⏳ Task 3.1.4: Load Testing
**Complexity**: Complex
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Test relay server under load.

**Acceptance Criteria**:
- [ ] Install k6 or Artillery for load testing
- [ ] Create load test scenarios:
  - 1,000 concurrent connections
  - 10,000 concurrent connections
  - 100 messages/sec
  - 1,000 messages/sec
- [ ] Measure metrics:
  - Connection time
  - Message latency (p50, p95, p99)
  - Error rate
  - Memory usage
  - CPU usage
- [ ] Identify bottlenecks
- [ ] Document performance benchmarks
- [ ] Set up continuous performance testing

**Dependencies**: All Phase 1 tasks

---

## 3.2 React Example Application

### ⏳ Task 3.2.1: Create React Example dApp
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Example dApp using React.

**Acceptance Criteria**:
- [ ] Create `examples/react-dapp/` directory
- [ ] Initialize with Vite + React + TypeScript
- [ ] Install `@nano-connect/sdk`
- [ ] Implement components:
  - `ConnectButton` - Initiates connection
  - `QRCodeModal` - Shows QR code
  - `AccountInfo` - Displays connected accounts
  - `SignBlockForm` - Request signature
- [ ] Show connection status
- [ ] Handle errors gracefully
- [ ] Add styling (Tailwind or CSS)
- [ ] Add README with setup instructions
- [ ] Deploy to Vercel/Netlify

**Dependencies**: Phase 2 SDK tasks

---

### ⏳ Task 3.2.2: Create React Native Example Wallet
**Complexity**: Complex
**Priority**: P2 (Medium)
**Estimated Time**: 12 hours

**Description**: Example wallet app using React Native.

**Acceptance Criteria**:
- [ ] Create `examples/react-native-wallet/` directory
- [ ] Initialize with Expo or React Native CLI
- [ ] Install `@nano-connect/sdk`
- [ ] Implement screens:
  - QR Scanner (using react-native-camera)
  - Session Approval
  - Sign Request Approval
  - Active Sessions List
- [ ] Implement Nano RPC calls (mock or real)
- [ ] Handle deep links
- [ ] Add navigation (React Navigation)
- [ ] Test on iOS and Android
- [ ] Add README with setup
- [ ] Document building and running

**Dependencies**: Phase 2 SDK tasks

---

## 3.3 Documentation

### ⏳ Task 3.3.1: Write API Documentation
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Comprehensive API reference.

**Acceptance Criteria**:
- [ ] Create `docs/api/` directory
- [ ] Document backend REST API:
  - All endpoints
  - Request/response examples
  - Error codes
- [ ] Document WebSocket RPC methods:
  - All methods
  - Request/response format
  - Examples
- [ ] Document SDK API:
  - All classes and methods
  - TypeScript signatures
  - Usage examples
- [ ] Generate with TypeDoc or similar
- [ ] Host on GitHub Pages or docs site
- [ ] Add search functionality

**Dependencies**: Phase 1 and Phase 2 tasks

---

### ⏳ Task 3.3.2: Write Integration Guides
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Step-by-step integration guides.

**Acceptance Criteria**:
- [ ] Create `docs/guides/` directory
- [ ] Write dApp integration guide:
  - Installation
  - Basic setup
  - Connecting to wallet
  - Signing blocks
  - Error handling
  - Best practices
- [ ] Write wallet integration guide:
  - Installation
  - Pairing with dApp
  - Handling requests
  - Account management
- [ ] Write deployment guide:
  - Environment setup
  - Configuration
  - Database setup
  - Scaling considerations
- [ ] Add code examples for each step
- [ ] Add troubleshooting section

**Dependencies**: Task 3.3.1

---

### ⏳ Task 3.3.3: Create Architecture Diagrams
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Visual architecture documentation.

**Acceptance Criteria**:
- [ ] Create diagrams with Draw.io or Mermaid:
  - System architecture overview
  - Connection flow sequence diagram
  - Sign request sequence diagram
  - Database schema ERD
  - WebSocket message flow
  - Encryption key exchange
- [ ] Export as SVG for docs
- [ ] Add to `docs/architecture/`
- [ ] Write explanations for each diagram
- [ ] Link from README

**Dependencies**: None (can be done anytime)

---

### ⏳ Task 3.3.4: Write Security Documentation
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Security best practices and threat model.

**Acceptance Criteria**:
- [ ] Create `docs/security.md`
- [ ] Document security features:
  - End-to-end encryption
  - Key management
  - Session expiry
  - Rate limiting
- [ ] Document threat model:
  - What attacks are prevented
  - What's out of scope
  - Assumptions
- [ ] Security best practices:
  - For dApp developers
  - For wallet developers
  - For relay operators
- [ ] Vulnerability disclosure policy
- [ ] Security audit recommendations

**Dependencies**: None

---

### ⏳ Task 3.3.5: Create FAQ and Troubleshooting Guide
**Complexity**: Simple
**Priority**: P2 (Medium)
**Estimated Time**: 4 hours

**Description**: Common questions and issues.

**Acceptance Criteria**:
- [ ] Create `docs/FAQ.md`
- [ ] Common questions:
  - How is Nano Connect different from WalletConnect?
  - Is my private key safe?
  - What happens if relay goes down?
  - Can I self-host the relay?
  - How much does it cost?
- [ ] Troubleshooting section:
  - Connection fails
  - QR code doesn't scan
  - Messages not delivered
  - Session expired
- [ ] Performance optimization tips
- [ ] Link to GitHub issues for support

**Dependencies**: None

---

## 3.4 Polish & Optimization

### ⏳ Task 3.4.1: Optimize Bundle Size
**Complexity**: Medium
**Priority**: P2 (Medium)
**Estimated Time**: 6 hours

**Description**: Reduce SDK bundle size.

**Acceptance Criteria**:
- [ ] Analyze bundle with webpack-bundle-analyzer
- [ ] Remove unused dependencies
- [ ] Tree-shake crypto libraries
- [ ] Use dynamic imports for QR code generation
- [ ] Minimize and compress outputs
- [ ] Target: < 50KB gzipped for core
- [ ] Target: < 20KB gzipped without QR code
- [ ] Document bundle sizes in README

**Dependencies**: Task 2.1.2

---

### ⏳ Task 3.4.2: Add TypeScript Strict Mode
**Complexity**: Medium
**Priority**: P2 (Medium)
**Estimated Time**: 4 hours

**Description**: Enable strict TypeScript checks.

**Acceptance Criteria**:
- [ ] Enable strict mode in tsconfig.json
- [ ] Fix all type errors
- [ ] Add missing type annotations
- [ ] Remove `any` types
- [ ] Use strict null checks
- [ ] Enable `noImplicitAny`
- [ ] Verify build passes with zero errors

**Dependencies**: All Phase 2 tasks

---

### ⏳ Task 3.4.3: Improve Error Messages
**Complexity**: Simple
**Priority**: P2 (Medium)
**Estimated Time**: 3 hours

**Description**: User-friendly error messages.

**Acceptance Criteria**:
- [ ] Review all error messages
- [ ] Make them actionable:
  - What went wrong
  - Why it happened
  - How to fix it
- [ ] Add error documentation links
- [ ] Localization support (optional)
- [ ] Test all error scenarios
- [ ] Document common errors in FAQ

**Dependencies**: Task 2.6.6

---

### ⏳ Task 3.4.4: Add Logging Configuration
**Complexity**: Simple
**Priority**: P2 (Medium)
**Estimated Time**: 3 hours

**Description**: Configurable logging in SDK.

**Acceptance Criteria**:
- [ ] Add log level configuration:
  - error, warn, info, debug
- [ ] Default: warn in production, debug in dev
- [ ] Allow custom logger injection
- [ ] Log important events:
  - Connection state changes
  - Session lifecycle
  - Errors
- [ ] Respect user's log level
- [ ] Don't log sensitive data

**Dependencies**: None

---

---

# PHASE 4: Testing & Quality (Weeks 13-16)

## 4.1 Comprehensive Testing

### ⏳ Task 4.1.1: Achieve 80%+ Test Coverage (Backend)
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 16 hours

**Description**: Write unit tests for all backend code.

**Acceptance Criteria**:
- [ ] Unit tests for all services:
  - SessionService
  - MessageService
  - SubscriptionService
  - AuthService
- [ ] Unit tests for all controllers
- [ ] Unit tests for all middleware
- [ ] Unit tests for all utilities
- [ ] Test edge cases and error paths
- [ ] Mock external dependencies (DB, Redis)
- [ ] Run coverage report: `npm run test:coverage`
- [ ] Ensure 80%+ line coverage

**Dependencies**: All Phase 1 tasks

---

### ⏳ Task 4.1.2: Achieve 85%+ Test Coverage (SDK)
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 16 hours

**Description**: Write unit tests for all SDK code.

**Acceptance Criteria**:
- [ ] Unit tests for all client methods
- [ ] Unit tests for all crypto functions
- [ ] Unit tests for all utilities
- [ ] Mock WebSocket connections
- [ ] Mock relay responses
- [ ] Test error scenarios
- [ ] Run coverage: `npm run test:coverage`
- [ ] Ensure 85%+ line coverage

**Dependencies**: All Phase 2 tasks

---

### ⏳ Task 4.1.3: Browser Compatibility Testing
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Test SDK in all supported browsers.

**Acceptance Criteria**:
- [ ] Install Playwright or Puppeteer
- [ ] Test in browsers:
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+
- [ ] Test core functionality:
  - Connection
  - Encryption
  - QR code generation
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)
- [ ] Fix any compatibility issues
- [ ] Document browser support
- [ ] Add browser tests to CI

**Dependencies**: Phase 2 SDK tasks

---

### ⏳ Task 4.1.4: Security Testing
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 12 hours

**Description**: Security audit and penetration testing.

**Acceptance Criteria**:
- [ ] Test OWASP Top 10 vulnerabilities:
  - Injection attacks
  - Broken authentication
  - Sensitive data exposure
  - XML External Entities (XXE)
  - Broken access control
  - Security misconfiguration
  - Cross-Site Scripting (XSS)
  - Insecure deserialization
  - Using components with known vulnerabilities
  - Insufficient logging & monitoring
- [ ] Test rate limiting effectiveness
- [ ] Test session hijacking prevention
- [ ] Test message tampering detection
- [ ] Test replay attacks
- [ ] Document findings
- [ ] Fix all critical and high vulnerabilities
- [ ] Consider third-party security audit

**Dependencies**: All Phase 1 and Phase 2 tasks

---

### ⏳ Task 4.1.5: Stress Testing
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Test system under extreme load.

**Acceptance Criteria**:
- [ ] Test scenarios:
  - 10,000 concurrent connections
  - 100,000 messages in 1 minute
  - Rapid connect/disconnect cycles
  - Large message payloads (100KB)
- [ ] Monitor system resources:
  - CPU usage
  - Memory usage
  - Network bandwidth
  - Database connections
  - Redis memory
- [ ] Identify breaking points
- [ ] Optimize bottlenecks
- [ ] Document stress test results
- [ ] Set up alerts for resource limits

**Dependencies**: Task 3.1.4

---

## 4.2 Bug Fixes & Optimization

### ⏳ Task 4.2.1: Fix All Critical Bugs
**Complexity**: Variable
**Priority**: P0 (Critical)
**Estimated Time**: 20 hours

**Description**: Triage and fix all critical bugs found in testing.

**Acceptance Criteria**:
- [ ] Create bug tracking board (GitHub Issues)
- [ ] Prioritize by severity:
  - P0: Critical - blocks usage
  - P1: High - major functionality broken
  - P2: Medium - workaround exists
  - P3: Low - minor annoyance
- [ ] Fix all P0 bugs before beta
- [ ] Fix all P1 bugs before production
- [ ] Document fixes in changelog
- [ ] Add regression tests for each bug

**Dependencies**: All testing tasks

---

### ⏳ Task 4.2.2: Optimize Database Queries
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Improve database performance.

**Acceptance Criteria**:
- [ ] Analyze slow queries with pg_stat_statements
- [ ] Add missing indexes
- [ ] Optimize N+1 queries
- [ ] Use connection pooling effectively
- [ ] Add query result caching (Redis)
- [ ] Measure query performance improvement
- [ ] Document optimization techniques

**Dependencies**: Task 1.1.3

---

### ⏳ Task 4.2.3: Optimize WebSocket Performance
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Improve message throughput and latency.

**Acceptance Criteria**:
- [ ] Measure baseline message latency
- [ ] Optimize message serialization/deserialization
- [ ] Use binary encoding instead of JSON (optional)
- [ ] Batch messages when possible
- [ ] Reduce memory allocations
- [ ] Measure improvement
- [ ] Document optimizations

**Dependencies**: Task 1.3.3

---

### ⏳ Task 4.2.4: Memory Leak Detection
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Find and fix memory leaks.

**Acceptance Criteria**:
- [ ] Use Node.js profiling tools (heap snapshots)
- [ ] Run server under load for 24 hours
- [ ] Monitor memory usage over time
- [ ] Identify leaks (event listeners, unclosed connections, etc.)
- [ ] Fix all leaks
- [ ] Verify with long-running test
- [ ] Document common leak patterns to avoid

**Dependencies**: Phase 1 tasks

---

---

# PHASE 5: Documentation & Examples (Weeks 17-18)

## 5.1 Final Documentation

### ⏳ Task 5.1.1: Complete API Reference
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Finalize all API documentation.

**Acceptance Criteria**:
- [ ] Review and update all API docs
- [ ] Add missing method descriptions
- [ ] Add code examples for every endpoint
- [ ] Add curl examples
- [ ] Add SDK code examples
- [ ] Generate TypeDoc for SDK
- [ ] Host documentation website
- [ ] Add search functionality
- [ ] Add versioning support

**Dependencies**: Task 3.3.1

---

### ⏳ Task 5.1.2: Create Video Tutorials
**Complexity**: Medium
**Priority**: P2 (Medium)
**Estimated Time**: 12 hours

**Description**: Video guides for integration.

**Acceptance Criteria**:
- [ ] Create videos:
  - "Getting Started with Nano Connect" (5 min)
  - "Integrating into a React dApp" (10 min)
  - "Building a Nano Wallet with Nano Connect" (15 min)
  - "Deploying Your Own Relay Server" (10 min)
- [ ] Screen recording with voiceover
- [ ] Upload to YouTube
- [ ] Embed in documentation
- [ ] Add captions

**Dependencies**: Task 3.3.2

---

### ⏳ Task 5.1.3: Write Migration Guide (from custom solutions)
**Complexity**: Simple
**Priority**: P2 (Medium)
**Estimated Time**: 4 hours

**Description**: Help developers migrate to Nano Connect.

**Acceptance Criteria**:
- [ ] Create `docs/migration.md`
- [ ] Guide for migrating from:
  - Manual Nano RPC integration
  - Custom WebSocket solutions
- [ ] Step-by-step migration steps
- [ ] Code comparison (before/after)
- [ ] Common pitfalls
- [ ] Testing migration

**Dependencies**: None

---

## 5.2 Polish Examples

### ⏳ Task 5.2.1: Polish React Example
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Make example production-quality.

**Acceptance Criteria**:
- [ ] Improve UI/UX design
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add animations
- [ ] Improve responsiveness (mobile)
- [ ] Add analytics (optional)
- [ ] Add comprehensive README
- [ ] Deploy to production URL

**Dependencies**: Task 3.2.1

---

### ⏳ Task 5.2.2: Add More Examples
**Complexity**: Medium
**Priority**: P2 (Medium)
**Estimated Time**: 12 hours

**Description**: Create additional example applications.

**Acceptance Criteria**:
- [ ] Create `examples/vanilla-js/` - No framework example
- [ ] Create `examples/vue-dapp/` - Vue.js example
- [ ] Create `examples/next-dapp/` - Next.js SSR example
- [ ] Create `examples/electron-wallet/` - Desktop wallet
- [ ] Each with complete README
- [ ] Each deployable/runnable
- [ ] Add to documentation

**Dependencies**: Phase 2 SDK tasks

---

---

# PHASE 6: Beta Release (Weeks 19-20)

## 6.1 Pre-Launch Preparation

### ⏳ Task 6.1.1: Set Up Production Infrastructure
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 12 hours

**Description**: Deploy to production environment.

**Acceptance Criteria**:
- [ ] Provision production servers (AWS/GCP/DigitalOcean)
- [ ] Set up PostgreSQL with replication
- [ ] Set up Redis cluster
- [ ] Configure load balancer
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure domain: relay.nanoconnect.io
- [ ] Set up monitoring (Grafana + Prometheus)
- [ ] Set up logging (ELK stack)
- [ ] Set up alerting (PagerDuty)
- [ ] Document infrastructure

**Dependencies**: All Phase 1-4 tasks

---

### ⏳ Task 6.1.2: Configure CI/CD Pipeline
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Automated testing and deployment.

**Acceptance Criteria**:
- [ ] Set up GitHub Actions or GitLab CI
- [ ] Pipeline stages:
  - Lint (ESLint + Prettier)
  - Type check (tsc)
  - Unit tests
  - Integration tests
  - Build
  - Security scan
  - Deploy to staging
  - Deploy to production (manual trigger)
- [ ] Run on every PR
- [ ] Block merge if tests fail
- [ ] Automated version bumping
- [ ] Automated changelog generation

**Dependencies**: All code tasks

---

### ⏳ Task 6.1.3: Create Release Checklist
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 2 hours

**Description**: Document release process.

**Acceptance Criteria**:
- [ ] Create `docs/release-checklist.md`
- [ ] Pre-release checks:
  - All tests passing
  - No critical bugs
  - Documentation complete
  - Examples working
  - Security audit passed
- [ ] Release steps:
  - Update version
  - Update changelog
  - Tag release
  - Build packages
  - Publish to npm
  - Deploy backend
  - Announce release
- [ ] Post-release monitoring

**Dependencies**: None

---

### ⏳ Task 6.1.4: Beta Testing with Partners
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 20 hours (spread over 1-2 weeks)

**Description**: Invite partners for beta testing.

**Acceptance Criteria**:
- [ ] Identify 5-10 beta partners:
  - Wallet developers
  - dApp developers
- [ ] Provide beta access:
  - Beta relay URL
  - Beta SDK version
  - Documentation
  - Support channel (Discord/Slack)
- [ ] Collect feedback:
  - Bugs
  - Feature requests
  - UX issues
  - Documentation gaps
- [ ] Fix critical issues
- [ ] Iterate based on feedback
- [ ] Get approval for production release

**Dependencies**: All Phase 1-5 tasks

---

## 6.2 Beta Launch

### ⏳ Task 6.2.1: Publish Beta SDK to npm
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 2 hours

**Description**: Publish beta version to npm registry.

**Acceptance Criteria**:
- [ ] Create npm account (if needed)
- [ ] Configure package.json:
  - Version: 0.9.0-beta.1
  - License: MIT
  - Repository URL
  - Author info
- [ ] Build SDK: `npm run build`
- [ ] Test package: `npm pack` and test locally
- [ ] Publish: `npm publish --tag beta`
- [ ] Verify on npmjs.com
- [ ] Update documentation with installation

**Dependencies**: All SDK tasks

---

### ⏳ Task 6.2.2: Deploy Beta Relay Server
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Deploy relay to beta environment.

**Acceptance Criteria**:
- [ ] Deploy to beta.relay.nanoconnect.io
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Verify health endpoints
- [ ] Test WebSocket connections
- [ ] Monitor logs for errors
- [ ] Set up basic monitoring
- [ ] Announce beta relay URL

**Dependencies**: Task 6.1.1

---

### ⏳ Task 6.2.3: Announce Beta Release
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 3 hours

**Description**: Public announcement of beta.

**Acceptance Criteria**:
- [ ] Write announcement blog post:
  - What is Nano Connect
  - Key features
  - How to get started
  - Beta limitations
  - Feedback request
- [ ] Post on social media:
  - Twitter
  - Reddit (r/nanocurrency)
  - Nano Discord
- [ ] Email beta partners
- [ ] Update website with beta badge
- [ ] Link to documentation

**Dependencies**: Tasks 6.2.1, 6.2.2

---

### ⏳ Task 6.2.4: Monitor Beta Metrics
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: Ongoing during beta period

**Description**: Track usage and performance during beta.

**Acceptance Criteria**:
- [ ] Set up analytics dashboard
- [ ] Track metrics:
  - Daily active sessions
  - Message throughput
  - Error rates
  - Latency percentiles
  - User growth
- [ ] Daily check-ins on metrics
- [ ] Weekly reports
- [ ] Identify issues proactively
- [ ] Document lessons learned

**Dependencies**: Task 6.2.2

---

---

# PHASE 7: Production Release (Weeks 21-22)

## 7.1 Pre-Production

### ⏳ Task 7.1.1: Security Audit (External)
**Complexity**: Complex
**Priority**: P0 (Critical)
**Estimated Time**: 40 hours (external contractor)

**Description**: Third-party security audit.

**Acceptance Criteria**:
- [ ] Hire reputable security firm
- [ ] Provide codebase access
- [ ] Audit scope:
  - Backend security
  - Cryptography implementation
  - WebSocket security
  - Authentication
  - Infrastructure
- [ ] Receive audit report
- [ ] Fix all critical and high findings
- [ ] Get sign-off from auditor
- [ ] Publish audit summary (optional)

**Dependencies**: All code complete

---

### ⏳ Task 7.1.2: Performance Optimization Final Pass
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 8 hours

**Description**: Final optimization before launch.

**Acceptance Criteria**:
- [ ] Profile backend under load
- [ ] Identify remaining bottlenecks
- [ ] Optimize hot paths
- [ ] Reduce memory usage
- [ ] Verify performance targets met:
  - < 500ms p95 latency
  - 10,000+ concurrent connections
  - 99.9% uptime
- [ ] Document optimizations

**Dependencies**: All beta feedback addressed

---

### ⏳ Task 7.1.3: Create Production Runbook
**Complexity**: Medium
**Priority**: P1 (High)
**Estimated Time**: 6 hours

**Description**: Operations manual for production.

**Acceptance Criteria**:
- [ ] Create `docs/runbook.md`
- [ ] Common operations:
  - Deployment process
  - Rollback procedure
  - Database backup/restore
  - Scaling up/down
  - Certificate renewal
- [ ] Troubleshooting:
  - High CPU usage
  - High memory usage
  - Connection issues
  - Database issues
  - Redis issues
- [ ] Incident response plan
- [ ] Contact information

**Dependencies**: Task 6.1.1

---

### ⏳ Task 7.1.4: Create Marketing Materials
**Complexity**: Medium
**Priority**: P2 (Medium)
**Estimated Time**: 8 hours

**Description**: Prepare for launch announcement.

**Acceptance Criteria**:
- [ ] Create logo and branding
- [ ] Design banner images
- [ ] Write product description
- [ ] Create feature comparison chart (vs alternatives)
- [ ] Prepare demo video
- [ ] Create presentation deck
- [ ] Prepare FAQ
- [ ] Social media graphics

**Dependencies**: None

---

## 7.2 Production Launch

### ⏳ Task 7.2.1: Deploy to Production
**Complexity**: Medium
**Priority**: P0 (Critical)
**Estimated Time**: 4 hours

**Description**: Go-live deployment.

**Acceptance Criteria**:
- [ ] Deploy backend to relay.nanoconnect.io
- [ ] Deploy database with backups enabled
- [ ] Deploy Redis cluster
- [ ] Configure SSL
- [ ] Run database migrations
- [ ] Verify all services healthy
- [ ] Test end-to-end connection
- [ ] Enable monitoring and alerting
- [ ] Document deployment

**Dependencies**: Tasks 7.1.1, 7.1.2

---

### ⏳ Task 7.2.2: Publish v1.0 SDK to npm
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: 1 hour

**Description**: Publish stable v1.0 release.

**Acceptance Criteria**:
- [ ] Update version to 1.0.0
- [ ] Update changelog
- [ ] Build SDK: `npm run build`
- [ ] Publish: `npm publish` (removes beta tag)
- [ ] Create GitHub release
- [ ] Tag commit: `v1.0.0`
- [ ] Update documentation

**Dependencies**: Beta testing complete

---

### ⏳ Task 7.2.3: Launch Announcement
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: 4 hours

**Description**: Public launch announcement.

**Acceptance Criteria**:
- [ ] Publish blog post
- [ ] Tweet announcement
- [ ] Post on Reddit
- [ ] Post in Nano Discord
- [ ] Email community
- [ ] Press release (optional)
- [ ] Update website to v1.0
- [ ] Remove beta badges

**Dependencies**: Tasks 7.2.1, 7.2.2

---

### ⏳ Task 7.2.4: Post-Launch Monitoring
**Complexity**: Simple
**Priority**: P0 (Critical)
**Estimated Time**: Ongoing first week

**Description**: Close monitoring after launch.

**Acceptance Criteria**:
- [ ] 24/7 monitoring first 3 days
- [ ] Watch for:
  - Error spikes
  - Performance degradation
  - Unusual traffic
  - Security issues
- [ ] Rapid response to issues
- [ ] Daily status updates
- [ ] Fix critical issues immediately
- [ ] Document lessons learned

**Dependencies**: Task 7.2.1

---

## 7.3 Post-Launch

### ⏳ Task 7.3.1: Gather User Feedback
**Complexity**: Simple
**Priority**: P1 (High)
**Estimated Time**: Ongoing

**Description**: Collect feedback from early users.

**Acceptance Criteria**:
- [ ] Set up feedback channels:
  - GitHub Discussions
  - Discord server
  - Email support
- [ ] Create feedback form
- [ ] Monitor social media mentions
- [ ] Weekly feedback review
- [ ] Prioritize feature requests
- [ ] Document common issues

**Dependencies**: Launch complete

---

### ⏳ Task 7.3.2: Plan v1.1 Features
**Complexity**: Simple
**Priority**: P2 (Medium)
**Estimated Time**: 4 hours

**Description**: Roadmap for next release.

**Acceptance Criteria**:
- [ ] Review feedback and feature requests
- [ ] Prioritize by impact and effort
- [ ] Create GitHub milestones
- [ ] Plan v1.1 features:
  - Push notifications
  - Multi-account management
  - Batch signing
  - etc.
- [ ] Estimate timeline
- [ ] Publish roadmap

**Dependencies**: Task 7.3.1

---

### ⏳ Task 7.3.3: Community Building
**Complexity**: Medium
**Priority**: P2 (Medium)
**Estimated Time**: Ongoing

**Description**: Build developer community.

**Acceptance Criteria**:
- [ ] Create Discord server
- [ ] Write regular blog posts
- [ ] Host developer Q&A sessions
- [ ] Showcase community projects
- [ ] Create contributor guidelines
- [ ] Recognize contributors
- [ ] Build integrations directory

**Dependencies**: Launch complete

---

---

# Summary

## Task Count by Phase

| Phase | Tasks | Estimated Hours | Complexity |
|-------|-------|-----------------|------------|
| Phase 1: Backend Foundation | 27 tasks | ~135 hours | High |
| Phase 2: SDK Core | 32 tasks | ~175 hours | High |
| Phase 3: Integration & Features | 19 tasks | ~105 hours | Medium |
| Phase 4: Testing & Quality | 9 tasks | ~106 hours | High |
| Phase 5: Documentation & Examples | 7 tasks | ~52 hours | Medium |
| Phase 6: Beta Release | 8 tasks | ~51 hours | Medium |
| Phase 7: Production Release | 12 tasks | ~85 hours | Medium |
| **TOTAL** | **114 tasks** | **~709 hours** | - |

## Critical Path (P0 Tasks)

These tasks are blocking and must be completed before launch:

1. **Phase 1**: All infrastructure, WebSocket relay, session management, authentication
2. **Phase 2**: Complete SDK implementation (dApp + wallet clients)
3. **Phase 3**: End-to-end integration testing
4. **Phase 4**: Comprehensive testing (unit, integration, security)
5. **Phase 6**: Beta testing with partners
6. **Phase 7**: Security audit, production deployment

## Next Steps

1. ✅ Review this task list with the team
2. ✅ Assign task owners
3. ✅ Set up project management board (GitHub Projects or Jira)
4. ✅ Begin Phase 1: Backend Foundation
5. ✅ Weekly sprint planning and reviews

---

**Ready to build Nano Connect!** 🚀
