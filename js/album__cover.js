import { changeClass } from "./utils.js";

const roots = document.querySelectorAll('.album__cover');

setButtonListeners(roots);

let lastAlbum = null;

/**
 * 
 * @param {NodeListOf<Element>} roots 
 */
function setButtonListeners(roots) {
    roots.forEach(element => {
        const playButton = element.querySelector(".play-pause-button");

        playButton.addEventListener("click", (e)=>{
            if (lastAlbum && lastAlbum !== element) {
                lastAlbum.querySelector(".play-pause-button").classList.remove("paused");
            }
            changeClass(playButton, "paused");
            lastAlbum = element;
        });
    });
}