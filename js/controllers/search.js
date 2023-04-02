import "../components/music-search.js";
import "../components/footer.js";
import "../components/selected_playlist.js";

import { changeClass, TrackFromEntry, AlbumFromEntry, clearQueryFromUrl } from "../utils.js";
import { getNextItems, countryKey, checkForSavedTracks, checkForUserLoggedIn } from "../api.js";

import { fillHtmlTemplate as fillTrack, setListenersForTrack } from "../components/track-container.js";
import { fillHtmlTemplate as fillCover, setListenersForCover } from "../components/album__cover.js";

import { Track } from "../models/track.mjs";
import { Album } from "../models/album.mjs";
import { setPopupListeners } from "./selected_playlist.js";


checkForUserLoggedIn();


class SearchController {
    constructor() {
        this.tracks = [];
        this.albums = [];

        this.maxTracksInPage = 50;
        this.maxAlbumsInPage = 10;

        this.expand_btn = document.querySelector('.expand-btn');

        this.tracksTarget = document.querySelector('.found-tracks-container');
        this.albumsTarget = document.querySelector('.one-line-playlists__container');

        this.albumsContainer = document.querySelector('.one-line-playlists');
        this.tracksContainer = document.querySelector('.found-tracks');
    }


    async onload() {
        const params = new URLSearchParams(window.location.search);

        let q = params.get('q');

        if (!q) {
            window.location.href = window.location.origin + '/ITAndDDP/pages/general.html';
        }

        q = decodeURIComponent(q);

        document.querySelector('.music-search__input').value = q;
        clearQueryFromUrl();

        this.clearContainers();

        let market = localStorage.getItem(countryKey);
        market = market === String(undefined) ? undefined : market;

        getNextItems(
            `https://api.spotify.com/v1/search?q=${q}&type=track&include_external=audio&offset=0&limit=50${market ? `&market=${market}` : ''}`,
            TrackFromEntry,
            newTracks => {
                this.tracks = [...this.tracks, ...newTracks];
                searchController.AddTracksIntoHtml(newTracks);

                console.log('total tracks lenght: ' + this.tracks.length);
            },
            'tracks',
            undefined,
            this.maxTracksInPage,
        );

        await getNextItems(
            `https://api.spotify.com/v1/search?q=${q}&type=album&include_external=audio&offset=0&limit=50${market ? `&market=${market}` : ''}`,
            AlbumFromEntry,
            newAlbums => {
                this.albums = [...this.albums, ...newAlbums];
                searchController.AddAlbumsIntoHtml(newAlbums);

                console.log('total albums lenght: ' + this.albums.length);
            },
            'albums',
            undefined,
            this.maxAlbumsInPage,
            album => album.album_type === 'album',
        );

        // bad sport
        setTimeout(function () {
            setPopupListeners();
        }, 2000);
    }


    setButtonListeners() {
        const container = document.querySelector('.one-line-playlists__container');
        const btnValues = ['Expand', 'Collapse'];
        let btnState = 0;

        this.expand_btn.onclick = (e) => {
            btnState ^= 1;
            this.expand_btn.innerHTML = btnValues[btnState];

            changeClass(container, 'expanded');
        };
    }

    /**
     * 
     * @param {Track[]} tracks 
     * @param {Album[]} albums 
     */
    placeIntoHtml(tracks, albums) {
        this.tracksTarget.innerHTML = '';
        this.albumsTarget.innerHTML = '';

        if (albums.length > 0) {
            AddAlbumsIntoHtml(albums);
        }
        else {
            this.albumsContainer.style.display = "none";
        }

        if (tracks.length > 0) {
            AddTracksIntoHtml(tracks);
        }
        else {
            this.tracksContainer.style.display = "none";
        }
    }


    async AddTracksIntoHtml(tracks) {
        const len = tracks.length;

        if (len < 1) {
            return;
        }

        this.tracksContainer.style.display = "flex";

        await checkForSavedTracks(tracks.map(track => track.id)).
            then(async added => {
                for (let i = 0; i < len; i += 2) {
                    let track1 = tracks[i];
                    let track2 = tracks[i + 1];

                    await (fillTrack(track1, added[i])
                        .then(res1 => {
                            fillTrack(track2, added[i + 1])
                                .then(res2 => {
                                    this.tracksTarget.innerHTML +=
                                        `
                                            <div class="found-tracks__row-container">
                                            ${res1}
                                            ${res2 ? res2 : ""}
                                            </div>
                                        `;
                                });
                        }));
                }

                setTimeout(
                    () => {
                        for (let i = 0; i < len; i++) {
                            setListenersForTrack(tracks[i].id);
                        }
                    },
                    200
                );
            });
    }

    async AddAlbumsIntoHtml(albums) {
        if (albums.length < 1) {
            return;
        }

        this.albumsContainer.style.display = "flex";

        albums.forEach(album => {
            this.albumsTarget.innerHTML += fillCover(album);
        });

        albums.forEach(album => {
            setListenersForCover(album.id);
        });
    }


    clearContainers() {
        this.tracksTarget.innerHTML = '';
        this.albumsTarget.innerHTML = '';
    }
}


let searchController = new SearchController();

searchController.setButtonListeners();
searchController.onload();
