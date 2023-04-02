import { Track } from "../models/track.mjs";
import { changeClass, msToTrackDuration } from "../utils.js";
import { addToQueue, getCurrentProgessMs, pause, playTrack, removeFromQueue, removeSavedTrack, saveTrack } from "../api.js";
import { playerStateTracker } from "../controllers/player_state_tracker.js";;

let lastTrackId = null;

export function setListenersForTrack(id) {
    const element = document.querySelector(`.track-container[data-id=\"${id}\"]`);
    if (!element) {
        setTimeout(
            () => {
                setListenersForTrack(id);
            },
            200
        );
        return;
    }

    element.querySelector('.track-container__button-wrap')
        .addEventListener('click', (e) => {
            handleTrackSelect(element);
        });

    element.querySelector(".play-pause-button")
        .addEventListener('click', (e) => {
            handleTrackSelect(element);
        });

    let playNextButton = element.querySelector('.track__button.play-next-button');
    playNextButton.addEventListener('click', (e) => {
        if (playNextButton.classList.contains('activated')) {
            removeFromQueue(id);
        }
        else {
            addToQueue(id);
        }

        changeClass(playNextButton, 'activated');
    });

    let addButton = element.querySelector('.track__button.add-button');
    addButton.addEventListener('click', (e) => {
        if (addButton.classList.contains('added')) {
            removeSavedTrack(id);
        }
        else {
            saveTrack(id);
        }

        changeClass(addButton, 'added');
    });
}

/**
 * 
 * @param {Element} trackContainer 
 */
function handleTrackSelect(trackContainer) {
    const id = trackContainer.attributes['data-id'].value;

    if (trackContainer.classList.contains('activated')) {
        pause(id);
    }
    else {
        if (lastTrackId === id) {
            getCurrentProgessMs()
                .then(progress_ms => {
                    playTrack(id, progress_ms);
                });
        }
        else {
            playTrack(id);
        }
    }

    lastTrackId = id;
}

/**
 * 
 * @param {Track} track
 * @returns {string}
 */
export async function fillHtmlTemplate(track, added = undefined) {
    if (!track) {
        return "";
    }

    let duration = msToTrackDuration(track.duration_ms);
    let performer = track.artists.map(artist => artist.name).join(', ');
    let imageUrl = track.images[2] ? track.images[2].url : "";

    return `
        <div class="track-container" data-id="${track.id}">
            <button class="track-container__button-wrap"></button>
            <div class="track__cover-wrap">
                <img class="track__cover" src="${imageUrl}" />
                <div class="play-pause-button-wrap">
                    <button class="play-pause-button"></button>
                </div>
            </div>
            <div class="track__title-wrap">
                <div class="audio__title">
                    <div class="audio__title__text-wrap">
                    <span class="song__title">
                        ${track.name}
                    </span>
                </div>
                <div class="audio__title__text-wrap">
                    <a class="song__performer" href="search.html?q=${encodeURIComponent(performer)}">
                        ${performer}
                    </a>
                </div>
                </div>
            </div>
            <div class="track__buttons-container">
                <div class="track__button-wrap">
                    <button class="track__button play-next-button">
                        <svg class="icon play-next">
                            <line x1="0" x2="13" y1="1" y2="1" />
                            <line x1="0" x2="6" y1="7" y2="7" />
                            <line x1="0" x2="6" y1="13" y2="13" />
                            <polygon points="9 7, 9 12, 13 9.5" />
                        </svg>
                        <svg class="icon remove-next">
                            <line x1="0" x2="13" y1="1" y2="1" />
                            <line x1="0" x2="6" y1="7" y2="7" />
                            <line x1="0" x2="6" y1="13" y2="13" />
                            <polyline points="8 8, 13 13" />
                            <polyline points="8 13, 13 8" />
                        </svg>
                    </button>
                </div>
                <div class="track__button-wrap">
                    <button class="track__button add-button ${added ? "added" : ""}">
                        <svg class="icon add">
                            <line x1="0" x2="14" y1="7" y2="7" />
                            <line x1="7" x2="7" y1="0" y2="14" />
                        </svg>
                        <svg class="icon remove">
                            <line x1="1" x2="13" y1="1" y2="13" />
                            <line x1="1" x2="13" y1="13" y2="1" />
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                <span class="track__duration">${duration}</span>
            </div>
        </div>
        `;
}

/**
 * 
 * @param {Track} track 
 * @param {Number} number 
 * @param {Boolean} added 
 * @returns 
 */
export function fillAlbumTrackHtmlTemplate(track, number, added = false) {
    if (!track) {
        return "";
    }

    let duration = msToTrackDuration(track.duration_ms);
    let performer = track.artists.map(artist => artist.name).join(', ');

    return `
        <div class="track-container" data-id="${track.id}">
            <button class="track-container__button-wrap"></button>
            <div class="track__number-wrap">
                <span class="track__number">${number}</span>
                <div class="play-pause-button-wrap">
                    <button class="play-pause-button"></button>
                </div>
            </div>
            <div class="track__title-wrap">
                <h3 class="track__title">${performer} - ${track.name}</h3>
            </div>
            <div class="track__buttons-container">
                <div class="track__button-wrap">
                    <button class="track__button play-next-button">
                        <svg class="icon play-next">
                            <line x1="0" x2="13" y1="1" y2="1" />
                            <line x1="0" x2="6" y1="7" y2="7" />
                            <line x1="0" x2="6" y1="13" y2="13" />
                            <polygon points="9 7, 9 12, 13 9.5" />
                        </svg>
                        <svg class="icon remove-next">
                            <line x1="0" x2="13" y1="1" y2="1" />
                            <line x1="0" x2="6" y1="7" y2="7" />
                            <line x1="0" x2="6" y1="13" y2="13" />
                            <polyline points="8 8, 13 13" />
                            <polyline points="8 13, 13 8" />
                        </svg>
                    </button>
                </div>
                <div class="track__button-wrap">
                    <button class="track__button add-button ${added ? "added" : ""}">
                        <svg class="icon add">
                            <line x1="0" x2="14" y1="7" y2="7" />
                            <line x1="7" x2="7" y1="0" y2="14" />
                        </svg>
                        <svg class="icon remove">
                            <line x1="1" x2="13" y1="1" y2="13" />
                            <line x1="1" x2="13" y1="13" y2="1" />
                        </svg>
                    </button>
                </div>
            </div>
            <div>
                <span class="track__duration">${duration}</span>
            </div>
        </div>
    `;
}

export function removeActivatedClassesWithId(id) {
    const elements = document.querySelectorAll(`.track-container[data-id=\"${id}\"]`);
    if (!elements) {
        return;
    }

    elements.forEach(element => {
        const playNextButton = element.querySelector('.play-pause-button');
        element.classList.remove('activated');
        playNextButton.classList.remove('activated');
    });
}

export function removeActivatedClassesFromElement(element) {
    const playNextButton = element.querySelector('.play-pause-button');
    element.classList.remove('activated');
    playNextButton.classList.remove('activated');
}

export function addActivatedClassesWithId(id) {
    const elements = document.querySelectorAll(`.track-container[data-id=\"${id}\"]`);
    if (!elements) {
        return;
    }

    elements.forEach(element => {
        const playPause = element.querySelector(".play-pause-button");
        element.classList.add('activated');
        playPause.classList.add('activated');
    });
}

export function addActivatedClassesToElement(element) {
    const playPause = element.querySelector(".play-pause-button");
    element.classList.add('activated');
    playPause.classList.add('activated');
}

playerStateTracker.addStateChangeHandler(
    (lastState, currentState) => {
        return true;
    },
    (lastState, currentState) => {
        const currentTrackId = currentState.track_id;

        const activated = document.querySelectorAll(`.track-container.activated${currentState.is_playing ? `:not([data-id="${currentTrackId}"])` : ""}`);
        activated.forEach(element => {
            removeActivatedClassesFromElement(element);
        });

        if (currentState.is_playing) {
            addActivatedClassesWithId(currentState.track_id);
        }
    },
);