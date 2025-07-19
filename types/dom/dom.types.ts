type CreateElement = {
    tagName: string;
    className: string;
    attributes?: { [key: string]: string };
    innerElements?: string[] | HTMLElement[];
};

export { CreateElement };
