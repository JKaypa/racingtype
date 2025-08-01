import { Room, User } from '../types.js';

type UpdateRooms = { rooms?: Room[]; roomsToRemove?: string[] };
type TimerBeforeStart = { secondsBefore: number; textId?: number };

type ServerToClientEvents = {
    redirect: (msg: string) => void;
    updateRooms: (arg: UpdateRooms) => void;
    joinDone: (roomName: string, usersJoined: User[]) => void;
    unauthorized: (message: string) => void;
    gotReady: (ready: string, userName: string) => void;
    timerBeforeStart: (arg: TimerBeforeStart) => void;
    timerLeft: (secondsLeft: number) => void;
    progression: (progress: number, userName: string) => void;
    finished: (places: string[]) => void;
    leaveRoom: (userName: string) => void;
};

type ClientToServerEvents = {
    joinRoom: (roomName: string) => void;
    getReady: () => void;
    progression: (progress: number) => void;
    restart: () => void;
    leaveRoom: () => void;
};

export type { ServerToClientEvents, ClientToServerEvents, TimerBeforeStart };
