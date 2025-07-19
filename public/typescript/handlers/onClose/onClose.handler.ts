import { changeReadyStatus, setProgress } from '~typescript/views/user.js';

const onClose = (users: string[]) => {
    const timer = <HTMLElement>document.getElementById('game-timer');
    const quitRoomButton = <HTMLButtonElement>document.getElementById('quit-room-btn');
    const barElements = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('finished');
    const textContainer = <HTMLElement>document.getElementById('text-container');
    const readyButton = <HTMLButtonElement>document.getElementById('ready-btn');
    const none = 'display-none';

    timer.className = none;
    quitRoomButton.className = 'quit-room-btn';
    textContainer.className = none;
    readyButton.className = 'ready-button';
    readyButton.innerText = 'Ready';

    [...barElements].forEach(bar => (bar.style.width = '0%'));
    users.forEach(username => {
        changeReadyStatus({ username, ready: '' });
        setProgress({ username, progress: 0 });
    });
};

export { onClose };
