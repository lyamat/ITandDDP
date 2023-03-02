import { changeClass } from "./utils.js";

const root = document.querySelector('.playlist__add-button');

setEventListeners(root);

/**
 * 
 * @param {Element} root 
 */
function setEventListeners(root) {
    root.addEventListener('click', (e)=>{
        changeClass(root, 'added');
    });
}