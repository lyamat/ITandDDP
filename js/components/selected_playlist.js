import "../components/track-container.js";

import { changeClass } from "../utils.js";
import { Album } from "../models/album.mjs";
import { fillAlbumTrackHtmlTemplate, fillHtmlTemplate as fillTrack } from "../components/track-container.js";
import { addAlbumToUserLibrary, checkForSavedAlbum, checkForSavedTracks, removeAlbumFromUserLibrary } from "../api.js";


export function setButtonListeners(albumId) {
    const button = document.querySelector('.playlist__add-button');
    if (!button) {
        return;
    }
    
    button.addEventListener('click', (e) => {
        if (button.classList.contains('added')) {
            removeAlbumFromUserLibrary(albumId);
        }
        else {
            addAlbumToUserLibrary(albumId);
        }

        changeClass(button, 'added');
    });
}

/**
 * 
 * @param {Album} album 
 * @returns 
 */
export async function fillAlbumHtmlTemplate(album) {
    if (!album) {
        return;
    }

    return checkForSavedAlbum(album.id).then(addedAlbum => {
        return checkForSavedTracks(album.tracks.map(track => track.id)).then(addedTracks => {
            return `
                <div class="selected-playlist-container">
                    <div class="playlist__header-container">
                        <img class="playlist__cover" src="${album.images[0].url}" />
                        <div class="playlist__info-container">
                            <div class="playlist__info__inner-container">
                                <h1 class="playlist__title">${album.name}</h1>
                                <a href="search.html">
                                    <h2 class="playlist__performer">${album.artists.map(artist => artist.name).join(', ')}</h2>
                                </a>
                                <span class="playlist__additional-info">${album.releaseDate}</span>
                            </div>
                            <div class="playlist__toolbar">
                                <button class="playlist__add-button ${addedAlbum ? 'added' : ''}">
                                    <svg class="icon add">
                                        <line x1="0" x2="11" y1="5.5" y2="5.5" />
                                        <line x1="5.5" x2="5.5" y1="0" y2="11" />
                                    </svg>
                                    <svg class="icon added">
                                        <polyline points="0 8, 3.5 10, 10 3" />
                                    </svg>
                                    <span class="playlist__add-button__text add">Add</span>
                                    <span class="playlist__add-button__text added">Added</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="playlist__tracks-container">
                    ${(() => {
                    const res = [];

                    if (!album.tracks) {
                        return '';
                    }

                    for (const num in album.tracks) {
                        res.push(fillAlbumTrackHtmlTemplate(album.tracks[num], Number(num) + 1, addedTracks[num]));
                    }

                    return res.join('');
                })()
                }
                    </div>
                    <div class="playlist__stats-wrap">
                        <span class="playlist__stats${album.tracks.length} tracks</span>
                    </div>
                </div>
            `;
        });
    });
}

export async function fillPlaylistHtmlTemplate(playlist) {
    if (!playlist) {
        return;
    }

    return checkForSavedTracks(playlist.tracks.map(track => track.id)).then(addedTracks => {
        return `
                <div class="selected-playlist-container">
                    <div class="playlist__header-container">
                        <img class="playlist__cover" src="${playlist.images[0].url}" />
                        <div class="playlist__info-container">
                            <div class="playlist__info__inner-container">
                                <h1 class="playlist__title alone">${playlist.name}</h1>
                                <a href="search.html">
                                    <h1 class="playlist__performer">${playlist.artists.map(artist => artist.name).join(', ')}</h1>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="playlist__tracks-container">
                    ${(() => {
                const res = [];

                if (!playlist.tracks) {
                    return '';
                }

                for (const num in playlist.tracks) {
                    res.push(fillAlbumTrackHtmlTemplate(playlist.tracks[num], Number(num) + 1, addedTracks[num]));
                }

                return res.join('');
            })()}
                    </div>
                    <div class="playlist__stats-wrap">
                        <span class="playlist__stats${playlist.tracks.length} tracks</span>
                    </div>
                </div>
        `;
    });
}
