import { Event } from '~/enums/events.enum.js';
import { appendGameElement } from '~typescript/views/game.js';
import { appendUserElement } from '~typescript/views/user.js';
import { socket } from '~typescript/socket.js';
import { User } from '~/types/types.js';

const showActiveRoom = (roomName: string, usersJoined: User[], username: string | null) => {
    const goBackToRooms = () => {
        socket.emit(Event.LEAVE_ROOM);
        window.location.replace('/game');
    };

    const getReady = () => {
        socket.emit(Event.GET_READY);
    };

    appendGameElement({ roomName, goBackToRooms, getReady });

    for (let userJoined of usersJoined) {
        const isCurrentUser = userJoined.username === username;

        appendUserElement({ username: userJoined.username, isCurrentUser, ready: userJoined.ready });
    }
};

export { showActiveRoom };
