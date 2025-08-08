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

    void loadText(textId);

    if (!secondsBefore) {
        timer.className = 'display-none';

        const highlightedText = createElement({ tagName: 'span', className: 'highlight' });
        const nextCharacter = createElement({ tagName: 'span', className: 'next-character' });
        const basicText = createElement({ tagName: 'span', className: 'basic' });

        const firstLetter = text.charAt(0);
        const restText = text.substring(1);

        nextCharacter.textContent = firstLetter;
        basicText.textContent = restText;

        textContainer.className = 'text-container';
        textContainer.append(highlightedText, nextCharacter, basicText);

        let index = 0;
        const textLength = text.length;
        const range = document.createRange();

        return (event: KeyboardEvent) => {
            if (event.key === 'Shift') return;

            if (text.charAt(index) === event.key) {
                nextCharacter.className = 'next-character';
                ++index;
                const progress = (index / textLength) * 100;

                range.setStart(basicText.firstChild!, 0);
                range.setEnd(basicText.firstChild!, 1);
                highlightedText.innerText += nextCharacter.innerText;
                nextCharacter.innerText = range.extractContents().textContent!;

                socket.emit(Event.PROGRESSION, progress);
            } else {
                nextCharacter.className = 'wrong-character';
            }
        };
    }
};

export { startingGame };
