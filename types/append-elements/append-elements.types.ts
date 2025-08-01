import { Room, User } from '../types.js';

type AppendGame = {
    roomName: string;
    goBackToRooms: () => void;
    getReady: () => void;
};

type AppendUser = User & {
    isCurrentUser: boolean;
};

type AppendRoom = Omit<Room, 'isReady'> & {
    onJoin: () => void;
};

export type { AppendGame, AppendRoom, AppendUser };
