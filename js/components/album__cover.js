import { Album } from "../models/album.mjs";
import { changeClass } from "../utils.js";
import { getPlaybackStatus, pause, playAlbum } from "../api.js";
import { playerStateTracker } from "../controllers/player_state_tracker.js";


let lastAlbumId = null;


/**
 * 
 * @param {number} id 
 * @param {boolean} is_playlist
 */
export function setListenersForCover(id, is_playlist = false) {
    const element = document.querySelector(`.album__cover[data-id="${id}"]`);

    if (!element) {
        setTimeout(
            () => {
                setListenersForCover(id, is_playlist);
            },
            200
        );
        return;
    }

    // console.log(`Setting listeners for album cover with id \"${element.attributes['data-id'].value}\".`);

    const playButton = element.querySelector(".play-pause-button");

    playButton.onclick = (e) => {
        if (playButton.classList.contains('activated')) {
            pause(id);
        }
        else {
            if (lastAlbumId !== id) {
                playAlbum(id, 0, 0, is_playlist);
            }
            else {
                getPlaybackStatus()
                    .then(res => {
                        const progress_ms = res ? res.progress_ms : 0;
                        const position = res ? res.item.track_number - 1 : 0;

                        playAlbum(id, position, progress_ms, is_playlist);
                    });
            }
        }

        // changeClass(playButton, "activated");
        lastAlbumId = id;
    };
}


/**
 * 
 * @param {Album} album 
 * @returns {string}
 */
export function fillHtmlTemplate(album) {
    let performer = album.artists.map(artist => artist.name).join(', ');

    let image = album.images[1];
    if (!image) {
        image = album.images[0];
    }

    return `
        <div class="cover-container">
            <div class="album__cover" data-id="${album.id}">
                <button class="button-icon">
                    <img class="icon" src="${image.url}" ${album.name}>
                </button>
                <div class="play-pause-button-wrap">
                    <button class="play-pause-button"></button>
                </div>
            </div>
            <span class="album__title">${album.name}</span>
            <a class="album__performer" href="search.html?q=${encodeURIComponent(performer)}">${performer}</a>
            <span class="album__release-date">${album.releaseDate}</span>
        </div>
    `;
}

function removeActivatedClassesFromElement(element) {
    element.classList.remove("activated");
}

function addActivatedClassesToElement(element) {
    element.classList.add("activated");
}

function activateAlbum(id) {
    const album = document.querySelector(`.album__cover[data-id="${id}"]`);
    if (album) {
        album.querySelector('.play-pause-button').classList.add("activated");
        lastAlbumId = album.id;
    }
}

playerStateTracker.addStateChangeHandler(
    (lastState, currentState) => {
        return true;
    },
    (lastState, currentState) => {
        const currentAlbumId = currentState.album_id;

        const activated = document.querySelectorAll(`.album__cover${currentState.is_playing ? `:not([data-id="${currentAlbumId}"])` : ""} .play-pause-button.activated`);
        activated.forEach(element => {
            removeActivatedClassesFromElement(element);
        });

        if (currentState.is_playing && currentState.is_album_context) {
            activateAlbum(currentState.album_id);
        }
    },
);