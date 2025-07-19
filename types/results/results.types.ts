import { IO, RoomsWithUsers, Timer, User } from '../types.js';

type AllDoneResults = Omit<Timer, 'socket'>;

type TimeFinishedResults = {
    io: IO;
    roomName: string;
    roomUsers: RoomsWithUsers;
};

export { AllDoneResults, TimeFinishedResults };
