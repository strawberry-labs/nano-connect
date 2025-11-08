import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({
    namespace: 'relay',
    cors: { origin: '*' },
    transports: ['websocket'],
    maxHttpBufferSize: 100 * 1024, // 100 KB
}) // TODO: consider namespace change
export class RelayGateway {
    private readonly logger = new Logger(RelayGateway.name);
    private connections = new Map<string, Socket>();

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
        this.connections.set(client.id, client);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.connections.delete(client.id);
    }
}
