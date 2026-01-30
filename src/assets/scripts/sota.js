import '../styles/style.scss';
import { initSoChecklist } from './ui/sotaList.js';
import { initSotaIllustPanel } from './ui/sotaIllustPanel.js';
import { waitForImages } from './features/waitForImages.js';

window.addEventListener('DOMContentLoaded', () => {
    // HTML読み込みが終わったあとに実行される処理
    waitForImages(() => {
        document.body.classList.add('is-ready');
    });
    initSoChecklist();
    initSotaIllustPanel();
});