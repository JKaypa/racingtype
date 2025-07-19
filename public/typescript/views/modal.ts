import { createElement } from '../helpers/dom-helper.js';
import { ResultsModal, MessageModal, InputModal } from '~/types/types.js';

const showInputModal = ({ title, onChange = () => {}, onSubmit = () => {} }: InputModal) => {
    const rootElement = <HTMLElement>document.querySelector('#root');

    const modalElement = createModalElement(title);

    const submitButton = createElement({
        tagName: 'button',
        className: 'submit-btn',
        innerElements: ['Submit']
    });
    const inputElement = <HTMLInputElement>createElement({
        tagName: 'input',
        className: 'modal-input'
    });

    modalElement.append(getFooter([inputElement, submitButton]));
    rootElement.append(modalElement);

    submitButton.addEventListener('click', () => {
        modalElement.remove();
        onSubmit(inputElement.value);
    });
    inputElement.addEventListener('change', (event: Event) => onChange((event.target as HTMLInputElement).value));
};

const showResultsModal = ({ usersSortedArray, onClose = () => {} }: ResultsModal) => {
    const rootElement = <HTMLElement>document.querySelector('#root');

    const modalElement = createModalElement('Results: ');

    const resultElements = usersSortedArray.map((username, index) => {
        const place = ++index;

        return createElement({
            tagName: 'div',
            className: 'user-result',
            attributes: { 'data-username': username, 'data-place': place.toString() },
            innerElements: [`${place}) ${username}`]
        });
    });

    const bodyWrapper = createElement({
        tagName: 'div',
        className: 'body-wrapper',
        innerElements: resultElements
    });

    const closeButton = createElement({
        tagName: 'button',
        className: 'submit-btn',
        attributes: { id: 'quit-results-btn' },
        innerElements: ['Close']
    });

    modalElement.append(bodyWrapper);
    modalElement.append(getFooter([closeButton]));
    rootElement.append(modalElement);

    closeButton.addEventListener('click', () => {
        modalElement.remove();
        onClose(usersSortedArray);
    });
};

const showMessageModal = ({ message, onClose = () => {} }: MessageModal) => {
    const rootElement = <HTMLElement>document.querySelector('#root');

    const modalElement = createModalElement(message);

    const closeButton = createElement({
        tagName: 'button',
        className: 'submit-btn',
        innerElements: ['Close']
    });

    modalElement.append(getFooter([closeButton]));
    rootElement.append(modalElement);

    closeButton.addEventListener('click', () => {
        modalElement.remove();
        onClose();
    });
};

const createModalElement = (title: string) => {
    const titleElement = createElement({
        tagName: 'h1',
        className: 'title',
        innerElements: [title]
    });

    const modal = createElement({
        tagName: 'div',
        className: 'modal',
        innerElements: [titleElement]
    });

    return modal;
};

const getFooter = (children: HTMLElement[]) => {
    return createElement({
        tagName: 'div',
        className: 'inputs-wrapper',
        innerElements: children
    });
};

export { showInputModal, showResultsModal, showMessageModal };
