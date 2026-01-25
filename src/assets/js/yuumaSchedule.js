/**
 * yuumaSchedule.js
 *
 * 曜日ごとの
 * ・予定
 * ・持ち物
 * ・帰宅後やること
 * を表示する
 */

export function initYuumaSchedule() {
    const todayLabelEl = document.getElementById('today-label');
    const scheduleListEl = document.getElementById('schedule-list');
    const belongingsListEl = document.getElementById('belongings-list');
    const taskListEl = document.getElementById('task-list');

    if (!todayLabelEl || !scheduleListEl || !belongingsListEl || !taskListEl) {
        return;
    }

    /* =========================
       曜日定義
    ========================= */
    const WEEK_LABELS = ['にちようび', 'げつようび', 'かようび', 'すいようび', 'もくようび', 'きんようび', 'どようび'];
    const WEEK_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    const today = new Date();
    const dayIndex = today.getDay();
    const todayKey = WEEK_KEYS[dayIndex];

    todayLabelEl.textContent = `きょうは ${WEEK_LABELS[dayIndex]}`;

    /* =========================
        曜日別データ（JSON）
    ========================= */
    const WEEKLY_DATA = {
        mon: {
            schedule: ['🏫 がっこう'],
            belongings: ['👕体そう服', '👟上ぐつ', '👚エプロン', '🥤 すいとう', '🖊 ふでばこ', '📝 連絡袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: 'すいとうをだす' },
                { id: 'homework', icon: '📒', label: 'しゅくだい' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        },

        tue: {
            schedule: ['🏫 がっこう', '🏠チャイルドハート'],
            belongings: ['🥤 すいとう', '🖊 ふでばこ', '📝 連絡袋',],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: 'すいとうをだす' },
                { id: 'homework', icon: '📒', label: 'しゅくだい' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        },

        wed: {
            schedule: ['🏫 がっこう'],
            belongings: ['🥤 すいとう', '🖊 ふでばこ', '📝 連絡袋',],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: 'すいとうをだす' },
                { id: 'homework', icon: '📒', label: 'しゅくだい' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        },

        thu: {
            schedule: ['🏫 がっこう'],
            belongings: ['🥤 すいとう', '🖊 ふでばこ', '📝 連絡袋',],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: 'すいとうをだす' },
                { id: 'homework', icon: '📒', label: 'しゅくだい' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        },

        fri: {
            schedule: ['🏫 がっこう', '🏠チャイルドハート'],
            belongings: ['🥤 すいとう', '🖊 ふでばこ', '📝 連絡袋',],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: 'すいとうをだす' },
                { id: 'wash', icon: '🧼', label: '体そう服を洗たくものにだす' },
                { id: 'wash', icon: '🧼', label: 'エプロンを洗たくものにだす' },
                { id: 'wash', icon: '🧼', label: '上ぐつを洗たくものにだす' },
                { id: 'homework', icon: '📒', label: 'しゅくだい' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        },

        sat: {
            schedule: ['🏠チャイルドハート'],
            belongings: ['🥤 すいとう', '🍱お弁当', '👜お着換え袋',],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'リュックを部屋におく' },
                { id: 'wash', icon: '🧼', label: '🍱お弁当をだす' },
                { id: 'wash', icon: '🧼', label: 'すいとうをだす' },
                { id: 'homework', icon: '📒', label: 'しゅくだい（まだなら）' },
                { id: 'wash', icon: '🧼', label: '上ぐつを洗う' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        },
        sun: {
            schedule: ['🏠 おやすみの日'],
            belongings: [],
            tasks: [
                { id: 'rest', icon: '🌤', label: 'ゆっくりすごす' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' }
            ]
        }
    };

    const todayData = WEEKLY_DATA[todayKey];
    if (!todayData) return;

    /* =========================
        表示処理
    ========================= */

    // 予定
    scheduleListEl.innerHTML = '';
    todayData.schedule.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        scheduleListEl.appendChild(li);
    });

    // 持ち物
    belongingsListEl.innerHTML = '';
    todayData.belongings.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        belongingsListEl.appendChild(li);
    });

    // やること
    taskListEl.innerHTML = '';
    todayData.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';
        li.dataset.taskId = task.id;

        li.innerHTML = `
        <span class="task__icon">${task.icon}</span>
        <span class="task__label">${task.label}</span>
        <span class="task__result hanamaru">
            <img src="../assets/svg/flower-3.svg" alt="はなまる" />
        </span>
`;

        taskListEl.appendChild(li);
    });

    const STATUS_KEY = 'yuuma-task-status';
    const DATE_KEY = 'yuuma-task-date';

    function resetIfNewDay() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem(DATE_KEY);

        if (savedDate !== today) {
            localStorage.removeItem(STATUS_KEY);
            localStorage.setItem(DATE_KEY, today);
        }
    }

    function loadStatus() {
        return JSON.parse(localStorage.getItem(STATUS_KEY)) || {};
    }

    function saveStatus(status) {
        localStorage.setItem(STATUS_KEY, JSON.stringify(status));
    }

    /* =========================
   できた！保存ロジック
========================= */

    resetIfNewDay();

    let taskStatus = loadStatus();

    // 既存タスクに反映
    document.querySelectorAll('.task').forEach(taskEl => {
        const taskId = taskEl.dataset.taskId;

        if (taskStatus[taskId]) {
            taskEl.classList.add('is-done');
        }

        taskEl.addEventListener('click', () => {
            taskEl.classList.toggle('is-done');

            taskStatus[taskId] = taskEl.classList.contains('is-done');
            saveStatus(taskStatus);
        });
    });




}

