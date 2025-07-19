import { Server, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from '../types.js';

type IO = Server<ClientToServerEvents, ServerToClientEvents>;
type SocketServer = Socket<ClientToServerEvents, ServerToClientEvents>;

export { IO, SocketServer as Socket };
