import '../styles/style.scss';
import { initSoChecklist } from './ui/sotaList.js';
import { initSotaIllustPanel } from './ui/sotaIllustPanel.js';

window.addEventListener('DOMContentLoaded', () => {
    // HTML読み込みが終わったあとに実行される処理
    initSoChecklist();
    initSotaIllustPanel();
});