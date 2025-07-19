import { AppendGame } from '~/types/types.js';

export const appendGameElement = ({ roomName, goBackToRooms, getReady }: AppendGame): void => {
    const roomsPage = <HTMLElement>document.getElementById('rooms-page');
    const gamePage = <HTMLElement>document.getElementById('game-page');
    const name = <HTMLElement>document.getElementById('room-name');
    const quitRoomButton = <HTMLButtonElement>document.getElementById('quit-room-btn');
    const gameContainer = <HTMLElement>document.getElementById('game-container');
    const readyButton = <HTMLButtonElement>document.getElementById('ready-btn');
    const timer = <HTMLElement>document.getElementById('timer');

    roomsPage.style.cssText = 'display: none';

    gamePage.className = 'flex full-screen';
    gameContainer.className = 'game-container';
    readyButton.className = 'ready-btn';
    timer.className = 'timer';
    name.className = 'room-name';
    quitRoomButton.className = 'quit-room-btn';

    name.innerText = roomName;

    timer.textContent = '';

    quitRoomButton.addEventListener('click', goBackToRooms);
    readyButton.addEventListener('click', getReady);
};
