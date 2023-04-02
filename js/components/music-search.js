setInterval(() => {
    const searchBtn = document.querySelector('.music-search__button');
    const searchField = document.querySelector('.music-search__input');

    setHidePopupButtonListeners();

    function setHidePopupButtonListeners() {
        searchBtn.onclick = (e) => {
            const q = searchField.value.trim();

            if (q) {
                window.location.href = `${window.location.origin}/ITandDDP/pages/search.html?q=${encodeURIComponent(q)}`;
            }
        };
    }
}, 1000)