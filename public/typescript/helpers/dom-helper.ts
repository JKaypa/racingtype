import { CreateElement } from '~/types/types.js';

export const createElement = ({ tagName, className, attributes = {}, innerElements = [] }: CreateElement) => {
    const element = document.createElement(tagName);

    if (className) {
        addClass(element, className);
    }

    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

    innerElements.forEach((innerElement: string | Node) => element.append(innerElement));

    return element;
};

export const addClass = (element: HTMLElement, className: string) => {
    const classNames = formatClassNames(className);
    element.classList.add(...classNames);
};

export const removeClass = (element: HTMLElement, className: string) => {
    const classNames = formatClassNames(className);
    element.classList.remove(...classNames);
};

export const formatClassNames = (className: string) => className.split(' ').filter(Boolean);
