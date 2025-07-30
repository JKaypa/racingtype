const username = sessionStorage.getItem('username');

if (username) {
    window.location.replace('/game');
}

const submitButton = <HTMLButtonElement>document.getElementById('submit-button');
const input = <HTMLInputElement>document.getElementById('username-input');

const getInputValue = (): string => input.value;

const onClickSubmitButton = () => {
    const inputValue = getInputValue();
    if (!inputValue) {
        return;
    }
    sessionStorage.setItem('username', inputValue);
    window.location.replace('/game');
};

const onKeyUp = (event: KeyboardEvent) => {
    const enterKeyCode = 'Enter';
    if (event.key === enterKeyCode) {
        submitButton.click();
    }
};

submitButton.addEventListener('click', onClickSubmitButton);
window.addEventListener('keyup', onKeyUp);
