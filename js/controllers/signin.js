import { handleAuthRedirect } from "../api.js";
import "../components/login.js";

onPageLoad();

function onPageLoad() {
    const query = window.location.search;
    if (query.length > 0) {
        handleAuthRedirect(query);
    }
}