import { openOverlay } from "./overlay.js";
export function initHomeworkModal() {

    const template = document.getElementById("homework-check-modal");
    openOverlay({
        html: template.innerHTML
    });
}