import { changeClass } from "./utils.js";

const roots = document.querySelectorAll('.track-container');

let lastTrack = null;
setButtonListeners(roots);




/**
 * 
 * @param {NodeListOf<Element>} roots 
 */
function setButtonListeners(roots) {
    roots.forEach(element => {
        element.querySelector('.track-container__button-wrap').addEventListener("click", (e)=>{
            handleTrackSelect(element);
        });

        element.querySelector(".play-pause-button").addEventListener("click", (e)=>{
            handleTrackSelect(element);
        });

        let playNextButton = element.querySelector('.track__button.play-next-button');
        playNextButton.addEventListener('click', (e)=>{
            changeClass(playNextButton, 'activated');
        });

        let addButton = element.querySelector('.track__button.add-button');
        addButton.addEventListener('click', (e)=>{
            changeClass(addButton, 'added');
        });
    });
}

/**
 * 
 * @param {Element} trackContainer 
 */
function handleTrackSelect(trackContainer) {
    if (lastTrack && lastTrack !== trackContainer) {
        lastTrack.classList.remove("activated");
        lastTrack.querySelector(".play-pause-button").classList.remove('paused');
    }
    changeClass(trackContainer, "activated");
    changeClass(trackContainer.querySelector(".play-pause-button"), "paused");
    lastTrack = trackContainer;
}