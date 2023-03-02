import { changeClass } from './utils.js';

const root = document.querySelector(".footer__content");

setButtonListeners(root);
setRangeListeners(root);

/**
 * 
 * @param {Element} root 
 */
function setButtonListeners(root) {
    const play = root.querySelector('.player__icon');
    const prev = root.querySelector('.player__prev');
    const next = root.querySelector('.player__next');
    const shuffle = root.querySelector('.player__shuffle');
    const repeat = root.querySelector('.player__repeat');

    play.addEventListener('click', (e) => {
        changeClass(play, 'paused');
    });

    prev.addEventListener('click', (e) => {

    });

    next.addEventListener('click', (e) => {

    });

    shuffle.addEventListener('click', (e) => {
        changeClass(shuffle, 'activated');
    });

    repeat.addEventListener('click', (e) => {
        changeClass(repeat, 'activated');
    });
}

/**
 * 
 * @param {Element} root 
 */
function setRangeListeners(root) {
    const rangeInputs = root.querySelectorAll('input.slider[type="range"]');

    function handleInputChange(e) {
        let target = e.target;
        if (target.type !== 'range') {
            return;
        }

        const min = target.min;
        const max = target.max;
        const val = target.value;

        target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    }

    rangeInputs.forEach(input => {
        input.addEventListener('input', handleInputChange);
    });
}