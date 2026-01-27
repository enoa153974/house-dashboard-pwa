import { enableTouchSort } from './yuumaSchedule.js'

// 今日の伝言（追加タスク）
const EXTRA_TASKS_KEY = 'yuuma-extra-tasks';
const EXTRA_ORDER_KEY = 'yuuma-extra-task-order';
const DATE_KEY = 'yuuma-task-date';

export function initExtraTasks() {
    const listEl = document.getElementById('extra-task-list');
    const formEl = document.getElementById('extra-task-form');
    const inputEl = document.getElementById('extra-task-input');
    const resetBtn = document.getElementById('extra-task-reset');

    if (!listEl || !formEl || !inputEl) return;

    resetIfNewDayExtra();

    let extraTasks = loadExtraTasks();
    renderExtraTasks();

    /* =========================
       追加
    ========================= */
    formEl.addEventListener('submit', e => {
        e.preventDefault();

        const text = inputEl.value.trim();
        if (!text) return;

        extraTasks.push({
            id: `extra-${Date.now()}`,
            label: text,
            done: false
        });

        saveExtraTasks();
        renderExtraTasks();
        inputEl.value = '';
    });

    /* =========================
       全リセット
    ========================= */
    resetBtn?.addEventListener('click', () => {
        extraTasks = [];
        saveExtraTasks();
        localStorage.removeItem(EXTRA_ORDER_KEY);
        renderExtraTasks();
    });

    /* =========================
       表示 & 並び替え
    ========================= */
    function renderExtraTasks() {
        listEl.innerHTML = '';

        // 並び順復元
        const order = JSON.parse(localStorage.getItem(EXTRA_ORDER_KEY));
        let tasksToRender = [...extraTasks];

        if (order) {
            tasksToRender.sort(
                (a, b) => order.indexOf(a.id) - order.indexOf(b.id)
            );
        }

        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task';
            li.dataset.taskId = task.id;

            if (task.done) li.classList.add('is-done');

            li.innerHTML = `
                <span class="task__label">${task.label}</span>
                <span class="task__result hanamaru">
                    <img src="/svg/flower-3.svg" alt="はなまる" draggable="false">
                </span>
            `;

            // 短押し：できた！
            li.addEventListener('click', () => {
                if (reorderState.isReordering) return;
                task.done = !task.done;
                saveExtraTasks();
                renderExtraTasks();
            });

            listEl.appendChild(li);
        });

        // 並び替え有効化
        enableTouchSort(listEl, saveExtraOrder, reorderState);
    }

    /* =========================
       保存系
    ========================= */
    function saveExtraTasks() {
        localStorage.setItem(EXTRA_TASKS_KEY, JSON.stringify(extraTasks));
    }

    function saveExtraOrder() {
        const order = [...listEl.children].map(li => li.dataset.taskId);
        localStorage.setItem(EXTRA_ORDER_KEY, JSON.stringify(order));
    }

    function loadExtraTasks() {
        return JSON.parse(localStorage.getItem(EXTRA_TASKS_KEY)) || [];
    }

    function resetIfNewDayExtra() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem(DATE_KEY);

        if (savedDate !== today) {
            localStorage.removeItem(EXTRA_TASKS_KEY);
            localStorage.removeItem(EXTRA_ORDER_KEY);
            localStorage.setItem(DATE_KEY, today);
        }
    }
}

/* 並び替え中フラグ（共通） */
const reorderState = { isReordering: false };