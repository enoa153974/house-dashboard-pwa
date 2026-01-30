/**
 * soIllustPanel.js
 *
 * ・そーくん用 応援イラスト＆コメント
 * ・リロードごとにランダム表示
 * ・直前と同じキャラは出さない
 * ・タイピング演出は外から開始
 */

let typingTimer = null;
let currentMessage = ''; // ← 後で使う

export function initSotaIllustPanel() {

    const imageEl = document.getElementById('illustImage');
    const messageEl = document.getElementById('illustMessage');

    if (!imageEl || !messageEl) return;

    const STORAGE_KEY = 'so-illust-last-index';

    const ILLUST_SET = [
        { image: '/images/yuuka.jpg', message: '計算通り♪完璧～！' },
        { image: '/images/kikyou.jpg', message: '状況、把握しました。' },
        { image: '/images/kazusa.jpg', message: '……別に、嫌じゃないし。' },
        { image: '/images/mine.jpg', message: '規律は、力です。' },
        { image: '/images/mari-.jpg', message: '神さまが見守っています。' },
        { image: '/images/mimori.jpg', message: '流れに任せましょう。' },
        { image: '/images/miyako.jpg', message: '了解です！任務開始！' },
        { image: '/images/mika.jpg', message: 'ねえ、無理してない？' },
        { image: '/images/nagisa.jpg', message: '落ち着いて、優雅に。' },
        { image: '/images/toki.jpg', message: '判断に、問題なし。' }
    ];

    const lastIndex = Number(localStorage.getItem(STORAGE_KEY));

    let index;
    do {
        index = Math.floor(Math.random() * ILLUST_SET.length);
    } while (ILLUST_SET.length > 1 && index === lastIndex);

    localStorage.setItem(STORAGE_KEY, index);

    const selected = ILLUST_SET[index];

    // 画像だけ先に表示
    imageEl.src = selected.image;

    // メッセージは保存しておくだけ
    currentMessage = selected.message;
    messageEl.textContent = '';
}

/* =========================
    タイピング開始（外から呼ぶ）
========================= */
export function startTyping(speed = 70) {

    const messageEl = document.getElementById('illustMessage');
    if (!messageEl || !currentMessage) return;

    clearInterval(typingTimer);
    messageEl.textContent = '';

    let index = 0;

    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    cursor.textContent = '｜';
    messageEl.appendChild(cursor);

    typingTimer = setInterval(() => {
        if (index < currentMessage.length) {
            cursor.before(currentMessage[index]);
            index++;
        } else {
            clearInterval(typingTimer);
        }
    }, speed);
}