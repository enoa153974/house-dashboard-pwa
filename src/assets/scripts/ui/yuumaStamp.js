/* デバッグ用・開発ツールのコンソールログに下記を打ち込みエンター
リセット：
localStorage.removeItem('yuuma-stamp-count');
localStorage.removeItem('yuuma-stamp-last-date');

10個たまったときの花丸演出：
localStorage.setItem('yuuma-stamp-count', 9);
localStorage.removeItem('yuuma-stamp-last-date');
location.reload();
*/


// yuuma-stamp.js（花丸演出つき完成版）
export function initYuumaStamp() {
    const STORAGE_KEY = 'yuuma-stamp-count';
    const DATE_KEY = 'yuuma-stamp-last-date';
    const MAX_STAMP = 10;
    const STAMP_IMG = '/images/stamp.png'; // 好きな画像パス

    const $stamps = $('.stamp');
    const $addBtn = $('.stamp-action-btn');
    const $overlay = $('#hanamaru-overlay');
    const $overlayBtn = $('.hanamaru__btn');
    const $resetBtn = $('.stamp-reset-btn');

    if ($stamps.length === 0 || $addBtn.length === 0) return;

    function loadCount() {
        const value = localStorage.getItem(STORAGE_KEY);
        return value ? Number(value) : 0;
    }

    function saveCount(count) {
        localStorage.setItem(STORAGE_KEY, count);
    }

    function getToday() {
        const now = new Date();
        return now.toISOString().slice(0, 10);
    }

    function render(count) {
        $stamps.removeClass('is-filled').html('<span class="stamp-empty">○</span>');


        $stamps.each(function (index) {
            if (index < count) {
                $(this)
                    .addClass('is-filled')
                    .html(`<img src="${STAMP_IMG}" alt="stamp" class="stamp-img">`);

            }
        });
    }

    function showHanamaru() {
        $overlay.removeClass('is-hidden');
        $('body').addClass('no-scroll');
    }

    function hideHanamaru() {
        $overlay.addClass('is-hidden');
        $('body').removeClass('no-scroll');
    }


    function addStamp() {
        let count = loadCount();
        if (count >= MAX_STAMP) return;

        count++;

        // 最大到達
        if (count === MAX_STAMP) {
            saveCount(0);
            render(0);
            showHanamaru(); // ←ここで表示
            return;
        }

        saveCount(count);
        render(count);
    }


    $overlayBtn.off('click').on('click', function () {
        hideHanamaru();
    });


    // 初期表示（保険つき）
    const initialCount = loadCount();
    if (initialCount >= MAX_STAMP) {
        saveCount(0);
        render(0);
    } else {
        render(initialCount);
    }


    $addBtn.off('click').on('click', addStamp);

    $resetBtn.on('click', function () {
        if (confirm('スタンプをリセットする？')) {
            saveCount(0);
            render(0);
        }
    });

}