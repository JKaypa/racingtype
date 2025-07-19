import { IO, RoomsWithUsers, Socket, User } from '../types.js';

type Timer = {
    currentUser: User;
    io: IO;
    isAllDone?: boolean;
    roomName: string;
    roomUsers: RoomsWithUsers;
    socket: Socket;
};

type TimerBefore = Pick<Timer, 'io' | 'roomName'> & {
    textId: number;
};

type TimerLeft = Omit<Timer, 'socket' | 'isAllDone'>;

type ClearTimerLeft = {
    isAllDone?: boolean;
    isEmpty?: boolean;
    secondsLeft?: number;
    timerLeft: NodeJS.Timeout;
};
export { ClearTimerLeft, Timer, TimerBefore, TimerLeft };
