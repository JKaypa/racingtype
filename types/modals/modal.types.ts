type InputModal = {
    title: string;
    onChange?: (value: string) => void;
    onSubmit: (value: string) => void;
};

type ResultsModal = {
    usersSortedArray: string[];
    onClose: (users: string[]) => void;
};

type MessageModal = {
    message: string;
    onClose?: () => void;
};

export type { InputModal, ResultsModal, MessageModal };
