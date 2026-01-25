import { initYuumaSchedule } from './yuumaSchedule.js';
import { initExtraTasks } from './extraTasks.js';
import '../styles/style.scss';

window.addEventListener('DOMContentLoaded', () => {
    // HTML読み込みが終わったあとに実行される処理
    console.log('yuuma.js loaded');
    initYuumaSchedule();
    initExtraTasks();
});