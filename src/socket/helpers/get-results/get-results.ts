import { Event } from '~/enums/events.enum.js';
import { AllDoneResults, RoomsWithUsers, TimeFinishedResults, User } from '~/types/types.js';

let results = new Set<string>();

const resetUsers = (roomUsers: RoomsWithUsers, roomName: string) => {
    roomUsers.get(roomName)?.forEach(user => {
        delete user.progress;
        delete user.ready;
    });
};

const allDoneResults = ({ currentUser, io, roomName, roomUsers }: AllDoneResults) => {
    const clearTimer = true;

    roomUsers.get(roomName)?.forEach(user => {
        if (!results.has(user.username) && user.progress === 100) {
            results.add(user.username);
        }
    });

    const isUserGone = results.has(currentUser.username) && !roomUsers.get(roomName)?.has(currentUser);
    if (isUserGone) {
        results.delete(currentUser.username);
    }

    if (results.size === roomUsers.get(roomName)?.size) {
        io.in(roomName).emit(Event.FINISHED, [...results]);
        results.clear();
        return clearTimer;
    }
};

const timeFinishedResults = ({ io, roomName, roomUsers }: TimeFinishedResults) => {
    results.clear();

    const users = [...(roomUsers.get(roomName) as Set<User>)];
    const places = users.sort((userA, userB) => userB.progress! - userA.progress!).map(user => user.username);

    io.in(roomName).emit(Event.FINISHED, places);
};

export { allDoneResults, resetUsers, timeFinishedResults };
