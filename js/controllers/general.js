import "../components/music-search.js";
import "../components/footer.js";
import "../components/track-container.js";

import "../components/logout.js";

import { setListenersForCover } from "../components/album__cover.js";
import { setPopupListeners } from "../controllers/selected_playlist.js";

import { checkForUserLoggedIn, getRecomendations } from "../api.js";
import { fillHtmlTemplate } from "../components/album__cover.js";
import { changeClass } from "../utils.js";


checkForUserLoggedIn();

const root = document.querySelector('.general-container');
document.querySelectorAll('.one-line-playlists').forEach(element => element.remove());

const categotiesCount = 5;

(async () => {
    await getRecomendations(categotiesCount, category => {
        root.innerHTML += fillCategoryHtmlTemplate(category);

        setTimeout(
            () => {
                category.playlists.forEach(playlist => {
                    setListenersForCover(playlist.id, true);
                });
            },
            200
        );
    });

    setTimeout(
        () => {
            setPopupListeners(true);
            setButtonListeners();
        },
        1000
    );
})();

function fillCategoryHtmlTemplate(category) {
    const res = `
        <div class="one-line-playlists">
            <div class="one-line-playlists__tools">
                <h3 class="primary-text">${category.name}</h3>
                <button class="ref-text expand-btn">Expand</button>
            </div>
            <div class="one-line-playlists__container">
                ${(() => {
            const res = [];

            category.playlists.forEach(playlist => {
                res.push(fillHtmlTemplate(playlist));
            });

            return res.join('');
        })()}
            </div>
        </div>
    `;

    return res;
}

function setButtonListeners() {
    const categoriesContainers = document.querySelectorAll('.one-line-playlists');
    categoriesContainers.forEach(element => {
        const container = element.querySelector('.one-line-playlists__container');
        const btnValues = ['Expand', 'Collapse'];
        const btn = element.querySelector('.expand-btn');
        let btnState = 0;

        btn.addEventListener('click', (e) => {
            btnState ^= 1;
            btn.innerHTML = btnValues[btnState];
            changeClass(container, 'expanded');
        });
    });
}