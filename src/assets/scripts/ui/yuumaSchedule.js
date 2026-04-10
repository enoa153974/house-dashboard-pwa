/**
 * yuumaSchedule.js
 *
 * ・曜日ごとの予定 / 持ち物 / やること表示
 * ・短押し：できた！（はなまる）
 * ・長押し：並び替えモード → 指で上下入れ替え
 *
 * ※ Android Chrome 安定動作版
 * ※ HTML5 Drag & Drop は使っていない
 */

import { enableTouchSort } from '../common/touchSort.js'
export function initYuumaSchedule() {

    /* =========================
       DOM取得
    ========================= */
    const todayLabelEl = document.getElementById('today-label');
    const scheduleListEl = document.getElementById('schedule-list');
    const belongingsListEl = document.getElementById('belongings-list');
    const taskListEl = document.getElementById('task-list');

    if (!todayLabelEl || !scheduleListEl || !belongingsListEl || !taskListEl) return;

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
        並び替え状態
    ========================= */
    const reorderState = { isReordering: false };

    /* =========================
        曜日別データ
    ========================= */
    const WEEKLY_DATA = {
        mon: {
            schedule: ['🏫 がっこう'],
            belongings: ['👕体そう服', '👟上ぐつ', '👚エプロン', '🥤 水筒', '🖊 ふでばこ', '📝 連絡袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: '水筒をだす' },
                { id: 'homework', icon: '📒', label: '宿題' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }
            ]
        },
        tue: {
            schedule: ['🏫 がっこう', '🏠チャイルドハート'],
            belongings: ['🥤 水筒', '🖊 ふでばこ', '📝 連絡袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: '水筒をだす' },
                { id: 'homework', icon: '📒', label: '宿題' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }

            ]
        },
        wed: {
            schedule: ['🏫 がっこう'],
            belongings: ['🥤 水筒', '🖊 ふでばこ', '📝 連絡袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: '水筒をだす' },
                { id: 'homework', icon: '📒', label: '宿題' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }

            ]
        },
        thu: {
            schedule: ['🏫 がっこう'],
            belongings: ['🥤 水筒', '🖊 ふでばこ', '📝 連絡袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash', icon: '🧼', label: '水筒をだす' },
                { id: 'homework', icon: '📒', label: '宿題' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }

            ]
        },
        fri: {
            schedule: ['🏫 がっこう', '🏠チャイルドハート'],
            belongings: ['🥤 水筒', '🖊 ふでばこ', '📝 連絡袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'ランドセルを部屋におく' },
                { id: 'wash1', icon: '🧼', label: '水筒をだす' },
                { id: 'wash2', icon: '🧼', label: '体そう服、エプロン、上ぐつを洗たくものにだす' },
                { id: 'homework', icon: '📒', label: '宿題' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }

            ]
        },
        sat: {
            schedule: ['🏠チャイルドハート'],
            belongings: ['🥤 水筒', '🍱お弁当', '👜お着換え袋'],
            tasks: [
                { id: 'bag', icon: '🎒', label: 'リュックを部屋におく' },
                { id: 'wash1', icon: '🧼', label: '🍱お弁当をだす' },
                { id: 'wash2', icon: '🧼', label: '水筒をだす' },
                { id: 'homework', icon: '📒', label: '宿題（まだなら）' },
                { id: 'wash3', icon: '🧼', label: '上ぐつを洗う' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }
            ]
        },
        sun: {
            schedule: ['🏠 おやすみの日'],
            belongings: [],
            tasks: [
                { id: 'rest', icon: '🌤', label: 'ゆっくりすごす' },
                { id: 'play', icon: '🎮', label: 'あそんでいいよ' },
                { id: 'dinner', icon: '🍽', label: '晩ご飯' },
                { id: 'bath', icon: '🛁', label: 'おふろ' },
                { id: 'teeth', icon: '🪥', label: 'はみがき' },
                { id: 'water_toilet', icon: '🚰🚽', label: 'お水を飲む＆トイレ' },
                { id: 'switch_phone', icon: '📱', label: 'スマホとswitchお片付け（充電）' }

            ]
        }
    };

    const todayData = WEEKLY_DATA[todayKey];
    if (!todayData) return;

    /* =========================
        表示：予定・持ち物
    ========================= */
    scheduleListEl.innerHTML = '';
    todayData.schedule.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        scheduleListEl.appendChild(li);
    });

    belongingsListEl.innerHTML = '';
    todayData.belongings.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        belongingsListEl.appendChild(li);
    });

    /* =========================
        やること生成
    ========================= */
    taskListEl.innerHTML = '';
    todayData.tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task';
        li.dataset.taskId = task.id;

        li.innerHTML = `
            <span class="task__icon">${task.icon}</span>
            <span class="task__label">${task.label}</span>
            <span class="task__result hanamaru">
                <img src="/svg/flower-3.svg" alt="はなまる" draggable="false">
            </span>
        `;

        taskListEl.appendChild(li);
    });

    /* =========================
        並び順保存 / 復元
    ========================= */
    const ORDER_KEY = `yuuma-task-order-${todayKey}`;

    const savedOrder = JSON.parse(localStorage.getItem(ORDER_KEY));

    if (
        Array.isArray(savedOrder) &&
        savedOrder.length === todayData.tasks.length
    ) {
        savedOrder.forEach(id => {
            const el = taskListEl.querySelector(`[data-task-id="${id}"]`);
            if (el) taskListEl.appendChild(el);
        });
    }

    function saveTaskOrder() {
        const order = [...taskListEl.children].map(li => li.dataset.taskId);
        localStorage.setItem(ORDER_KEY, JSON.stringify(order));
    }

    /* =========================
        タッチ並び替え有効化
    ========================= */
    enableTouchSort(
        taskListEl,
        saveTaskOrder,
        reorderState,
        '.task'
    );
    /* =========================
        できた！保存
    ========================= */
    const STATUS_KEY = 'yuuma-task-status';
    const DATE_KEY = 'yuuma-task-date';

    resetIfNewDay();
    const taskStatus = JSON.parse(localStorage.getItem(STATUS_KEY)) || {};

    taskListEl.querySelectorAll('.task').forEach(taskEl => {
        const id = taskEl.dataset.taskId;
        if (taskStatus[id]) taskEl.classList.add('is-done');

        taskEl.addEventListener('click', () => {
            if (reorderState.isReordering) return;
            taskEl.classList.toggle('is-done');
            taskStatus[id] = taskEl.classList.contains('is-done');
            localStorage.setItem(STATUS_KEY, JSON.stringify(taskStatus));
        });
    });

    function resetIfNewDay() {
        const todayStr = new Date().toDateString();
        if (localStorage.getItem(DATE_KEY) !== todayStr) {
            localStorage.removeItem(STATUS_KEY);
            localStorage.setItem(DATE_KEY, todayStr);
        }
    }
}
