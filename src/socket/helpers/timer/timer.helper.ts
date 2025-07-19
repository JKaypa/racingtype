import { Event } from '~/enums/events.enum.js';
import { texts } from '~/src/data.js';
import { Timer, TimerBefore, TimerLeft } from '~/types/types.js';
import * as config from '~/src/socket/config.js';
import { allDoneResults, isRoomEmpty, isRoomReady, timeFinishedResults } from '../helpers.js';

const timerBeforeStart = ({ io, roomName, textId }: TimerBefore) => {
    let secondsBefore = config.SECONDS_TIMER_BEFORE_START_GAME;

    io.to(roomName).emit(Event.TIMER_BEFORE_START, { secondsBefore, textId });

    const timerBefore = setInterval(() => {
        --secondsBefore;

        if (!secondsBefore) clearInterval(timerBefore);

        io.to(roomName).emit(Event.TIMER_BEFORE_START, { secondsBefore });
    }, 1000);
};

const timerLeft = ({ io, roomName, currentUser, roomUsers }: TimerLeft) => {
    setTimeout(() => {
        let secondsLeft = config.SECONDS_FOR_GAME;

        io.to(roomName).emit(Event.TIMER_LEFT, secondsLeft);

        const timerLeft = setInterval(() => {
            --secondsLeft;
            io.to(roomName).emit(Event.TIMER_LEFT, secondsLeft);

            const isEmpty = isRoomEmpty(roomUsers, roomName);
            const isAllDone = allDoneResults({ currentUser, io, roomName, roomUsers });

            if (isAllDone || isEmpty) {
                clearInterval(timerLeft);
                return;
            } else if (!secondsLeft) {
                clearInterval(timerLeft);
                timeFinishedResults({ io, roomName, roomUsers });
                return;
            }
        }, 1000);
    }, config.SECONDS_TIMER_BEFORE_START_GAME * 1000);
};

const timer = ({ currentUser, io, roomName, roomUsers, socket }: Timer) => {
    const isReady = isRoomReady(roomUsers, roomName);

    if (isReady) {
        const textId = Math.floor(Math.random() * texts.length);

        socket.broadcast.emit(Event.UPDATE_ROOMS, { roomsToRemove: [roomName] });

        timerBeforeStart({ io, roomName, textId });

        timerLeft({ currentUser, io, roomName, roomUsers });
    }
};

export { timer };
