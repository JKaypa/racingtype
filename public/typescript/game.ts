import { Event } from '~/enums/events.enum.js';
import { showInputModal, showMessageModal, showResultsModal } from './views/modal.js';
import { showActiveRoom, startingGame, submit, updateRoomsView, onClose } from './handlers/handlers.js';
import { socketConnection } from './socket.js';
import { changeReadyStatus, removeUserElement, setProgress } from './views/user.js';

const username = sessionStorage.getItem('username');
const socket = socketConnection(username);
const user = <HTMLElement>document.getElementById('user');
const createRoomButton = <HTMLButtonElement>document.getElementById('add-room-btn');
const signOut = <HTMLButtonElement>document.getElementById('sign-out');
const goToSignin = () => {
    sessionStorage.removeItem('username');
    window.location.replace('/signin');
};

if (!username) {
    goToSignin();
}

user.innerText = `Welcome ${username}`;

let typing: ((event: KeyboardEvent) => void) | undefined;

createRoomButton.addEventListener('click', () => showInputModal({ title: 'Create room', onSubmit: submit }));
signOut.addEventListener('click', goToSignin);

socket.on(Event.REDIRECT, msg => {
    showMessageModal({ message: msg, onClose: goToSignin });
});

socket.on(Event.UPDATE_ROOMS, ({ rooms, roomsToRemove }) => {
    updateRoomsView(rooms, roomsToRemove);
});

socket.on(Event.UNAUTHORIZED, message => {
    showMessageModal({ message });
});

socket.on(Event.JOIN_DONE, (roomName, usersJoined) => {
    showActiveRoom(roomName, usersJoined, username);
});

socket.on(Event.GOT_READY, (ready, userName) => {
    if (userName === username) {
        const readyButton = <HTMLButtonElement>document.getElementById('ready-btn');
        readyButton.innerText = 'Not Ready';
    }

    changeReadyStatus({ ready, username: userName });
});

socket.on(Event.TIMER_BEFORE_START, ({ secondsBefore, textId }) => {
    typing = startingGame({ secondsBefore, textId });

    if (typing) window.addEventListener('keydown', typing);
});

socket.on(Event.PROGRESSION, (progress, username) => {
    setProgress({ progress, username });
});

socket.on(Event.TIMER_LEFT, secondsLeft => {
    const timer = <HTMLElement>document.getElementById('game-timer');

    timer.className = 'game-timer';
    timer.innerText = secondsLeft.toString();
});

socket.on(Event.FINISHED, usersSortedArray => {
    if (typing) window.removeEventListener('keydown', typing);
    showResultsModal({ usersSortedArray, onClose });

    socket.emit(Event.RESTART);
});

socket.on(Event.LEAVE_ROOM, userGone => {
    removeUserElement(userGone);
});
