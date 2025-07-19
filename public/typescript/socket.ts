import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '~/types/types.js';
import { server } from './service.js';

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

const socketConnection = (username: string | null) => {
    socket = io(server, {
        query: { username },
        transports: ['websocket']
    });
    return socket;
};

export { socket, socketConnection };
