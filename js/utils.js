/**
 * 
 * @param {Element} e 
 * @param {String} className 
 */
export function changeClass(e, className) {
    if (e.classList.contains(className)) {
        e.classList.remove(className);
    } else {
        e.classList.add(className);
    }
}