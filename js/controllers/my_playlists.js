import "../components/music-search.js";
import "../components/footer.js";
import "../components/track-container.js";
import "../components/logout.js";

import { Album } from "../models/album.mjs";
import { setListenersForCover, fillHtmlTemplate } from "../components/album__cover.js";

import { checkForUserLoggedIn, getNextItems, getUsersAlbums } from "../api.js";

import { setPopupListeners } from "./selected_playlist.js";
import { AlbumFromEntry } from "../utils.js";


checkForUserLoggedIn();

const target = document.querySelector('.multi-line-playlists');
target.innerHTML = "";

main();

async function main() {
    await getNextItems(
        'https://api.spotify.com/v1/me/albums?offset=0&limit=50',
        AlbumFromEntry,
        albums => { placeIntoHtml(albums); },
        undefined,
        'album'
    );

    setInterval(
        setPopupListeners,
        1000
    );
}

/**
 * 
 * @param {Album[]} albums 
 */
function placeIntoHtml(albums) {
    albums.forEach(album => {
        target.innerHTML += fillHtmlTemplate(album);

        albums.push(album);
        // setListenersForCover(album.id);  // i want to believe
    });

    albums.forEach(album => {
        setListenersForCover(album.id);
    });
}