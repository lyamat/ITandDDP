import { showPopupPlaylist } from "../controllers/selected_playlist.js";

let popup;
let covers;

export function setButtonListeners(is_playlists = false) {
    popup = document.querySelector('.popup');
    covers = document.querySelectorAll(".album__cover");

    setShowPopupButtonListeners(is_playlists);
    // setHidePopupButtonListeners();  // i want to believe
}

export function setHidePopupButtonListeners() {
    popup.querySelector('.popup__back-wrap').onclick = (e) => {
        popup.style.display = 'none';

        const selected_playlist = popup.querySelector('.selected-playlist-container');
        if (selected_playlist) {
            selected_playlist.remove();
        }
    };
}

function setShowPopupButtonListeners(is_playlists) {
    covers.forEach(cover => {
        const button = cover.querySelector('.button-icon');

        button.addEventListener("click", (e) => {
            popup.style.display = "block";
            showPopupPlaylist(cover.attributes['data-id'].value, is_playlists);
            // setHidePopupButtonListeners();  // i want to believe
        });
    });
}