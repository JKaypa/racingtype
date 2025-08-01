import { IO, RoomsWithUsers, Timer } from '../types.js';

type AllDoneResults = Omit<Timer, 'socket'>;

type TimeFinishedResults = {
    io: IO;
    roomName: string;
    roomUsers: RoomsWithUsers;
};

export type { AllDoneResults, TimeFinishedResults };
