const target = '.logout-btn';

setHidePopupButtonListeners();

function setHidePopupButtonListeners() {
    document.querySelector(target).addEventListener('click', (e)=>{
        localStorage.clear();
    });
}