import { setButtonListeners as setSelectedPlaylistButtonListeners } from "../components/selected_playlist.js";

import { setButtonListeners as setPopupButtonListeners, setHidePopupButtonListeners } from "../components/popup.js";
import { getAlbum, getPlaylist } from "../api.js";

import { fillAlbumHtmlTemplate, fillPlaylistHtmlTemplate } from "../components/selected_playlist.js";
import { setListenersForTrack } from "../components/track-container.js";

let popup;

export function setPopupListeners(is_playlists = false) {
    popup = document.querySelector('.popup');
    setPopupButtonListeners(is_playlists);
}

export function showPopupPlaylist(id, is_playlists) {
    const getContent = is_playlists ? getPlaylist : getAlbum;
    const fillHtmlTemplate = is_playlists ? fillPlaylistHtmlTemplate : fillAlbumHtmlTemplate;

    getContent(id).then(album => {
        fillHtmlTemplate(album).then(res => {
            popup.innerHTML += res;

            setSelectedPlaylistButtonListeners(id);
            setHidePopupButtonListeners();
        }).then(() => {
            album.tracks.forEach(track => {
                setListenersForTrack(track.id);
            });
        });
    });
}