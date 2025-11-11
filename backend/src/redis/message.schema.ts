export interface RelayMessage {
    id: string; // message ID, uuidv4
    topic: string; // session topic
    type: 'request' | 'response' | 'event';
    payload: EncryptedPayload;
    timestamp: number;
    ttl: number;
}

export interface EncryptedPayload {
    ciphertext: string; // base64 encoded
    iv: string; // base64 encoded nonce/IV
    tag: string; // base64 encoded auth tag
}
