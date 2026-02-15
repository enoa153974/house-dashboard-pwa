/**
 * =========================================================
 * ドリンク量メーターUIモジュール
 * ---------------------------------------------------------
 * 機能
 * ・クリックで量を加算
 * ・水位表示
 * ・日付が変わったらリセット
 * ・最大量制限
 * ・localStorage保存
 *
 * 再利用可能設計：
 * root要素を渡せば複数設置可能
 * =========================================================
 */

export function initDrinkMeter({
    root,               // UI全体の親要素（必須）
    max = 5,            // 1日の最大回数
    amountPerPush = 30, // 1プッシュ量（ml）※将来表示用
    storageKey = "drink-meter" // 保存キー識別子
}) {

    // ===============================
    // DOM取得（root配下限定）
    // ===============================
    const liquid = root.querySelector(".liquid"); // 水位部分
    const btn = root.querySelector(".drink-btn"); // 押すボタン
    const msg = root.querySelector(".drink-msg"); // メッセージ表示
    const resetBtn = root.querySelector(".drink-reset");//リセットボタン
    const cup = root.querySelector(".cup");//カップ

    // ===============================
    // localStorageキー生成
    // ===============================
    const COUNT_KEY = storageKey + "-count"; // 回数保存
    const DATE_KEY = storageKey + "-date";   // 日付保存


    // ===============================
    // ◆ 保存値取得
    // ===============================
    function load() {
        return Number(localStorage.getItem(COUNT_KEY)) || 0;
    }


    // ===============================
    // ◆ 保存処理
    // ===============================
    function save(v) {
        localStorage.setItem(COUNT_KEY, v);
    }

    // ------------------------------
    // ◆ リセット処理
    // ------------------------------
    function reset() {
        localStorage.removeItem(COUNT_KEY);
        localStorage.removeItem(DATE_KEY);
        render();
        msg.textContent = "";//テキストもリセット
    }


    // ===============================
    // ◆ 日付チェック
    // 日付が変わったら自動リセット
    // ===============================
    function checkDate() {

        const today = new Date().toDateString();
        const saved = localStorage.getItem(DATE_KEY);

        // 日付違ったら新日扱い
        if (saved !== today) {
            localStorage.setItem(DATE_KEY, today);
            save(0);
        }
    }


    // ===============================
    // ◆ 水位表示更新
    // ===============================
    function render(animate = false) {

        const count = load();
        const percent = (count / max) * 100;
        liquid.style.height = percent + "%";

        if (animate) {
            cup.classList.add("bump");
            setTimeout(() => cup.classList.remove("bump"), 250);

        }

    }



    // ===============================
    // ◆ ボタン押下処理
    // ===============================
    function handleDrink() {

        let count = load();

        // 最大超過防止
        if (count >= max) {
            msg.textContent = "今日はもうここまで！";
            return;
        }

        // 回数加算
        count++;
        save(count);

        // 表示更新
        render();

        // 最大到達メッセージ
        if (count === max) {
            msg.textContent = "今日はもうここまで！";
        }
    }


    // ===============================
    // ◆ 初期化処理
    // ===============================

    checkDate();   // 日付更新チェック
    render(true);      // 初期表示

    // ボタンイベント登録
    btn.addEventListener("click", handleDrink);
    resetBtn?.addEventListener("click", reset);
}
