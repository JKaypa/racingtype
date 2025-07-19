import { Event } from '~/enums/events.enum.js';
import { TimerBeforeStart } from '~/types/types.js';
import { createElement } from '~typescript/helpers/dom-helper.js';
import { socket } from '~typescript/socket.js';
import { server } from '~typescript/service.js';

let text: string;

const removeButtons = () => {
    const backToRooms = document.getElementById('quit-room-btn');
    const readyBtn = document.getElementById('ready-btn');

    if (backToRooms && readyBtn) {
        backToRooms.className = 'display-none';
        readyBtn.className = 'display-none';
    }
};

const loadText = async (textId: number | undefined) => {
    if (typeof textId === 'number') {
        const response = await fetch(`${server}/game/texts/${textId}`);
        const data: { text: string } = response.ok ? await response.json() : 'Something failed';
        text = data.text;
    }
};

const startingGame = ({ secondsBefore, textId }: TimerBeforeStart) => {
    removeButtons();

    const textContainer = <HTMLElement>document.getElementById('text-container');
    const timer = <HTMLElement>document.getElementById('timer');

    textContainer.childNodes.forEach(node => node.remove());
    timer.className = 'timer';
    timer.innerText = secondsBefore.toString();

    loadText(textId);

    if (!secondsBefore) {
        timer.className = 'display-none';

        const highlightedText = createElement({ tagName: 'span', className: 'highlight' });
        const basicText = createElement({ tagName: 'span', className: 'basic' });

        basicText.textContent = text;
        textContainer.className = 'text-container';
        textContainer.textContent = '';
        textContainer.append(highlightedText, basicText);

        let index = 0;
        const range = document.createRange();
        const textLength = text.length;

        return (event: KeyboardEvent) => {
            if (text.charAt(index) === event.key) {
                ++index;
                const progress = (index / textLength) * 100;
                range.setStart(basicText.firstChild!, 0);
                range.setEnd(basicText.firstChild!, 1);
                highlightedText.innerText = highlightedText.innerText + range.extractContents().textContent;

                socket.emit(Event.PROGRESSION, progress);
            }
        };
    }
};

export { startingGame };
