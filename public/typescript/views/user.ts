import { addClass, createElement } from '../helpers/dom-helper.js';
import { AppendUser } from '~/types/types.js';

const appendUserElement = ({ username, ready, isCurrentUser }: AppendUser) => {
    const usersContainer = <HTMLElement>document.querySelector('#users-wrapper');

    const usernameElement = createElement({
        tagName: 'div',
        className: 'username',
        attributes: { 'data-username': username },
        innerElements: [isCurrentUser ? `${username} (you)` : username]
    });

    const readyStatusElement = createElement({
        tagName: 'div',
        className: 'ready-status',
        attributes: { 'data-username': username, 'data-ready': String(Boolean(ready)) },
        innerElements: [getReadySign(ready)]
    });

    const headerWrapper = createElement({
        tagName: 'div',
        className: 'user-header',
        attributes: { 'data-username': username },
        innerElements: [readyStatusElement, usernameElement]
    });

    const progressElement = createElement({
        tagName: 'div',
        className: 'user-progress',
        attributes: { 'data-username': username, style: `width: 0%;` }
    });

    const progressElementBlock = createElement({
        tagName: 'div',
        className: 'user-progress-template',
        innerElements: [progressElement]
    });

    const userElement = createElement({
        tagName: 'div',
        className: 'user',
        attributes: { 'data-username': username },
        innerElements: [headerWrapper, progressElementBlock]
    });

    usersContainer.append(userElement);

    return userElement;
};

const changeReadyStatus = ({ username, ready }: { username: string; ready: string }) => {
    const readyStatusElement = <HTMLElement | null>document.querySelector(`.ready-status[data-username='${username}']`);

    if (readyStatusElement) {
        readyStatusElement.innerHTML = getReadySign(ready);
        readyStatusElement.dataset.ready = String(Boolean(ready));
    }
};

const setProgress = ({ username, progress }: { username: string; progress: number }) => {
    const progressElement = <HTMLElement>document.querySelector(`.user-progress[data-username='${username}']`);

    if (progress === 100) {
        progressElement.style.width = `${progress}%`;
        addClass(progressElement, 'finished');
    } else {
        progressElement.style.width = `${progress}%`;
        progressElement.classList.remove('finished');
    }
};

const removeUserElement = (username: string) => document.querySelector(`.user[data-username='${username}']`)?.remove();

const getReadySign = (ready: string | undefined) => (ready ? '🟢' : '🔴');

export { appendUserElement, changeReadyStatus, setProgress, removeUserElement };
