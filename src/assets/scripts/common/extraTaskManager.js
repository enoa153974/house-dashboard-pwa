// =======================================================
// 追加タスク管理モジュール
// -------------------------------------------------------
// ・タスク追加
// ・完了切替
// ・並び替え（ドラッグ）
// ・ローカル保存
// ・日付変わったら自動リセット
// =======================================================

import { enableTouchSort } from './touchSort.js';

/**
 * 追加タスク管理の初期化関数
 * @param {Object} options 設定オブジェクト
 * @param {HTMLElement} options.listEl タスク一覧のul要素
 * @param {HTMLElement} options.formEl 追加フォーム
 * @param {HTMLInputElement} options.inputEl 入力欄
 * @param {HTMLElement} options.resetBtn リセットボタン
 * @param {string} options.storageKeyPrefix localStorage識別用接頭辞
 * @param {string} [options.itemSelector='.task'] タスク要素セレクタ
 * @param {boolean} [options.showHanamaru=false] 花丸表示ON/OFF
 */
export function initExtraTaskManager({
    listEl,
    formEl,
    inputEl,
    resetBtn,
    storageKeyPrefix,
    itemSelector = '.task',
    showHanamaru = false
}) {

    // -------------------------
    // localStorageキー定義
    // -------------------------
    const TASKS_KEY = `${storageKeyPrefix}-tasks`; // タスク配列保存用
    const ORDER_KEY = `${storageKeyPrefix}-order`; // 並び順保存用
    const DATE_KEY = `${storageKeyPrefix}-date`;   // 日付保存用

    // 並び替え中かどうか判定（誤クリック防止）
    const reorderState = { isReordering: false };

    // 保存済タスク読み込み
    let tasks = loadTasks();

    // 日付が変わっていたら自動リセット
    const ENABLE_DAILY_RESET = false;//日付またぎ自動リセットのオンオフ切替
    if (ENABLE_DAILY_RESET) resetIfNewDay();

    // 初回描画
    render();

    // ==================================================
    // タスク追加処理
    // ==================================================
    formEl?.addEventListener('submit', e => {
        e.preventDefault();

        const text = inputEl.value.trim();
        if (!text) return; // 空入力防止

        // 新規タスク生成
        tasks.push({
            id: `${storageKeyPrefix}-${Date.now()}`, // 一意ID
            label: text,
            done: false
        });

        saveTasks();
        render();

        inputEl.value = ''; // 入力リセット
    });


    // ==================================================
    // 全リセットボタン
    // ==================================================
    resetBtn?.addEventListener('click', () => {
        tasks = [];
        saveTasks();
        localStorage.removeItem(ORDER_KEY);
        render();
    });


    // ==================================================
    // 描画処理
    // ==================================================
    function render() {

        // 一旦全削除
        listEl.innerHTML = '';

        // 保存済並び順取得
        const order = JSON.parse(localStorage.getItem(ORDER_KEY));
        let renderList = [...tasks];

        // 並び順復元
        if (order) {
            renderList.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
        }

        // 各タスク生成
        renderList.forEach(task => {

            const li = document.createElement('li');
            li.className = itemSelector.replace('.', '');
            li.dataset.taskId = task.id;

            // 完了状態
            if (task.done) li.classList.add('is-done');

            // HTML構築
            li.innerHTML = `
            <span class="task__label">${task.label}</span>
            ${showHanamaru
                                ? `
                    <span class="task__result hanamaru">
                    <img src="/svg/flower-3.svg" alt="はなまる" draggable="false">
                    </span>
                `
                                : ''
                            }
            `;

            // タップで完了切替
            li.addEventListener('click', () => {
                if (reorderState.isReordering) return; // 並び替え中は無効

                task.done = !task.done;
                saveTasks();
                render();
            });

            listEl.appendChild(li);
        });

        // 並び替え機能有効化
        enableTouchSort(listEl, saveOrder, reorderState, itemSelector);
    }


    // ==================================================
    // 保存処理
    // ==================================================
    function saveTasks() {
        localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    }


    // 並び順保存
    function saveOrder() {
        const order = [...listEl.children].map(li => li.dataset.taskId);
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    }


    // 読み込み
    function loadTasks() {
        return JSON.parse(localStorage.getItem(TASKS_KEY)) || [];
    }


    // ==================================================
    // 日付変更チェック
    // --------------------------------------------------
    // 日付が変わったら
    // ・タスク
    // ・並び順
    // を全削除
    // ==================================================
    function resetIfNewDay() {

        const today = new Date().toDateString();
        const saved = localStorage.getItem(DATE_KEY);

        if (saved !== today) {
            localStorage.removeItem(TASKS_KEY);
            localStorage.removeItem(ORDER_KEY);
            localStorage.setItem(DATE_KEY, today);
        }
    }
}
