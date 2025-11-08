import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

const MAX_BUFFER_SIZE = 100 * 1024; // 100 KB

@WebSocketGateway({
    namespace: 'relay',
    cors: { origin: '*' },
    transports: ['websocket'],
    maxHttpBufferSize: MAX_BUFFER_SIZE,
}) // TODO: consider namespace change
export class RelayGateway {
    private readonly logger = new Logger(RelayGateway.name);
    private connections = new Map<string, Socket>();

    handleConnection(client: Socket) {
        this.connections.set(client.id, client);

        this.logger.log(`Client connected: ${client.id}`);

        // Emit 'connected' event with server info
        client.emit('connected', {
            clientId: client.id,
            serverTime: Date.now(),
            version: '1.0.0', // TODO: get this from package.json
            protocol: 'nano-connect',
            features: [
                'irn_subscribe',
                'irn_unsubscribe',
                'irn_publish',
                'irn_ping',
            ],
            limits: {
                maxMessageSize: MAX_BUFFER_SIZE,
            },
        });
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connections.delete(client.id);
    }
}
