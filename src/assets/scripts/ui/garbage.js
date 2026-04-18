/**
 * garbage.js
 *
 * ゴミの日を曜日で判定して表示する
 */

export function initGarbage() {
    updateGarbage();
    scheduleMidnightUpdate();
}

//更新ロジック
function updateGarbage() {
    const commentEl = document.getElementById('garbage-comment');
    if (!commentEl) return;

    const GARBAGE_SCHEDULE = {
        1: 'ごみ',
        2: 'ビン・カン・段ボール',
        4: 'ごみ',
        5: 'プラ',
    };

    const now = new Date();
    const day = now.getDay();

    const todayGarbage = GARBAGE_SCHEDULE[day];

    // 👇 明日
    const tomorrow = (day + 1) % 7;
    const tomorrowGarbage = GARBAGE_SCHEDULE[tomorrow];

    // -------------------------
    // 表示
    // -------------------------

    let text = '';

    // 今日
    if (todayGarbage) {
        text += `今日は「${todayGarbage}」の日です！`;
    } else {
        text += '今日はゴミの日ではありません';
    }

    if (tomorrowGarbage) {
        text += `\n明日は「${tomorrowGarbage}」の日です`;
    }
    commentEl.textContent = text;
}


//0時更新ロジック
function scheduleMidnightUpdate() {
    const now = new Date();

    const nextMidnight = new Date();
    nextMidnight.setHours(24, 0, 0, 0);

    const msUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        updateGarbage();

        // 次の日以降は24時間ごと
        setInterval(updateGarbage, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}