const roots = document.querySelectorAll(".album__cover .button-icon");
const modal = document.querySelector(".popup");

setButtonListeners(roots);

/**
 * 
 * @param {NodeListOf<Element>} roots 
 */
function setButtonListeners(roots) {
    roots.forEach(element => {
        element.addEventListener("click", (e)=>{
            modal.style.display = "block";
        });
    });
}
