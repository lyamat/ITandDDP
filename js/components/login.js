import { loginUser } from '../api.js';

setButtonListeners();

function setButtonListeners() {
    const button = document.querySelector('.signing-form__button');
    button.addEventListener('click', (e)=>loginUser());
}