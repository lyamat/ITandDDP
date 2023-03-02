const root = document.querySelector('.popup');

setButtonListeners(root);

/**
 * 
 * @param {Element} root 
 */
function setButtonListeners(root) {
    const back = root.querySelector('.popup__back-wrap');
    back.addEventListener('click', (e)=>{
        root.style.display = 'none';
    });
}