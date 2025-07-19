import { Event } from '~/enums/events.enum.js';
import { socket } from '~typescript/socket.js';
import { showMessageModal } from '~typescript/views/modal.js';

export const submit = (inputValue: string | undefined) => {
    const nodeList = document.querySelectorAll('.room-name');
    const name = [...nodeList].find(roomName => roomName.textContent === inputValue);

    if (!inputValue) {
        return showMessageModal({ message: 'Provide a room name' });
    }

    name ? showMessageModal({ message: 'Duplicate room name' }) : socket.emit(Event.JOIN_ROOM, inputValue);
};
