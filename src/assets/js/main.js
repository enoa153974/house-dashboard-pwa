/**
 * main.js
 * 
 * jsファイルのエントリーポイント
 * - Sass/CSSや必要なJSをここでまとめて読み込む
 * - ページ全体で使う処理をここに書く
 * - DOMContentLoaded
 * - 初期化処理の呼び出し
 */

import '../styles/style.scss';
import { initClock } from './clock.js';
import { initWeather } from './weather.js';
import { initGarbage } from './garbage.js';
import { initMemo } from './memo.js';
import { initNav } from './nav.js';
import { initYuumaSchedule } from './yuumaSchedule.js';
import { initExtraTasks } from './extraTasks.js';
//import './switchPanel.js';
//import './panel.js';
//import { hamburger } from './hamburger.js';

/* Service Worker を登録 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}
window.addEventListener('DOMContentLoaded', () => {
    // HTML読み込みが終わったあとに実行される処理
    //hamburger();
    initClock();
    initWeather();
    initGarbage();
    initMemo();
    initNav();
    initYuumaSchedule();
    initExtraTasks();
    console.log('jsファイルの読み込みが完了しました！');
});