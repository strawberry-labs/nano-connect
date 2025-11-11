export interface Session {
    topic: string; // unique session identifier
    dappKey: string; // registered app ID (uuidv4)
    state: 'pending' | 'active' | 'expired' | 'disconnected';
    createdAt: number; // unix timestamp
    expiresAt: number; // unix timestamp
    lastActivity: number; // unix timestamp
}
