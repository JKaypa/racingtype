const Event = {
    REDIRECT: 'redirect',
    UPDATE_ROOMS: 'updateRooms',
    JOIN_ROOM: 'joinRoom',
    UNAUTHORIZED: 'unauthorized',
    JOIN_DONE: 'joinDone',
    GET_READY: 'getReady',
    GOT_READY: 'gotReady',
    TIMER_BEFORE_START: 'timerBeforeStart',
    TIMER_LEFT: 'timerLeft',
    PROGRESSION: 'progression',
    FINISHED: 'finished',
    RESTART: 'restart',
    LEAVE_ROOM: 'leaveRoom'
} as const;

export { Event };
