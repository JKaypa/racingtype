import { Room } from '~/types/types.js';

import { appendRoomElement, removeRoomElement, updateNumberOfUsersInRoom } from '~/public/typescript/views/room.js';
import { Event } from '~/enums/events.enum.js';
import { socket } from '~/public/typescript/socket.js';

const updateRoomsView = (rooms?: Room[], roomsToRemove?: string[]) => {
    const roomElements = document.getElementsByClassName('room-name');
    const roomList = [...roomElements];

    if (rooms) {
        rooms.forEach(({ name, numberOfUsers }) => {
            if (roomList.some(room => room.textContent === name)) {
                updateNumberOfUsersInRoom({ name, numberOfUsers });
            } else {
                const onJoin = () => socket.emit(Event.JOIN_ROOM, name);
                appendRoomElement({ name, numberOfUsers, onJoin });
            }
        });
    }

    if (roomsToRemove) {
        roomsToRemove.forEach(room => removeRoomElement(room));
    }
};

export { updateRoomsView };
