/**
 * nav.js
 *
 * 家族ページへの遷移ロジック
 */

/**
 * nav.js
 *
 * ナビゲーション関連の初期化
 */

export function initNav() {
    // 家族ページ遷移
    const pageButtons = document.querySelectorAll('.nav-btn[data-page]');
    pageButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            if (!page) return;

            navigator.vibrate?.(50);
            location.href = `/src/pages/${page}.html`;
        });
    });

    // ChatGPT ボタン
    const chatBtn = document.getElementById('btnChatGPT');
    chatBtn?.addEventListener('click', () => {
        navigator.vibrate?.(50);
        location.href = 'https://chatgpt.com/';
    });
}

