// 追加のやることロジック
const EXTRA_TASKS_KEY = 'yuuma-extra-tasks';
const DATE_KEY = 'yuuma-task-date';

export function initExtraTasks() {
    const listEl = document.getElementById('extra-task-list');
    const formEl = document.getElementById('extra-task-form');
    const inputEl = document.getElementById('extra-task-input');
    const resetBtn = document.getElementById('extra-task-reset');

    if (!listEl || !formEl || !inputEl) return;

    resetIfNewDayExtra();

    let extraTasks = loadExtraTasks();
    renderExtraTasks(extraTasks);

    /* 追加 */
    formEl.addEventListener('submit', (e) => {
        e.preventDefault();

        const text = inputEl.value.trim();
        if (!text) return;

        extraTasks.push({
            id: `extra-${Date.now()}`,
            label: text,
            done: false
        });

        saveExtraTasks(extraTasks);
        renderExtraTasks(extraTasks);
        inputEl.value = '';
    });

    /* 全リセット */
    resetBtn?.addEventListener('click', () => {
        extraTasks = [];
        saveExtraTasks(extraTasks);
        renderExtraTasks(extraTasks);
    });

    /* ---------- functions ---------- */

    function renderExtraTasks(tasks) {
        listEl.innerHTML = '';

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task';
            li.dataset.taskId = task.id;

            if (task.done) li.classList.add('is-done');

            li.innerHTML = `
        <span class="task__label">${task.label}</span>
        <span class="task__result hanamaru">
        <img src="/svg/flower-3.svg" alt="はなまる" />
        </span>
        `;

            li.addEventListener('click', () => {
                task.done = !task.done;
                saveExtraTasks(tasks);
                renderExtraTasks(tasks);
            });

            listEl.appendChild(li);
        });
    }

    function loadExtraTasks() {
        return JSON.parse(localStorage.getItem(EXTRA_TASKS_KEY)) || [];
    }

    function saveExtraTasks(tasks) {
        localStorage.setItem(EXTRA_TASKS_KEY, JSON.stringify(tasks));
    }

    function resetIfNewDayExtra() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem(DATE_KEY);

        if (savedDate !== today) {
            localStorage.removeItem(EXTRA_TASKS_KEY);
            localStorage.setItem(DATE_KEY, today);
        }
    }
}
