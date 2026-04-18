

/* =========================
    天気パネルの動作
========================= */
export function initWeather() {
    // ------------------------------
    // ◆ 変数の定義
    // ------------------------------

    //APIキーの定義
    const API_KEY = '431956e1ae5d6c3bde0cbdbaf7b3102e';

    //天気パネル
    const weatherPanel = document.getElementById('weather-panel');

    //天気の種類
    const statusEl = document.getElementById('weather-status');

    //気温
    const tempEl = document.getElementById('weather-temp');

    //服装アドバイスコメント
    const adviceEl = document.getElementById('weather-advice');

    //更新ボタン
    const refreshBtn = document.getElementById('weather-refresh');



    if (!statusEl || !tempEl || !weatherPanel) return;

    //初期状態
    let weatherInterval = null;
    //自動更新の時間
    const AUTO_UPDATE_INTERVAL = 30 * 60 * 1000;

    //天気を取得
    async function fetchWeather(retry = false) {

        if (!navigator.geolocation) {
            statusEl.textContent = '位置情報が使えません';
            return;
        }


        //読み込み中の表示
        statusEl.textContent = '天気取得中…';
        tempEl.textContent = '--℃';
        if (adviceEl) adviceEl.textContent = '';

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lon } = position.coords;

                try {
                    const res = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${API_KEY}`
                    );
                    const data = await res.json();

                    const temp = Math.round(data.main.temp);

                    setWeatherTheme(data.weather[0].main);
                    //取得してきた内容を表示
                    statusEl.textContent =
                        `${getWeatherIcon(data.weather[0].main)} ${data.weather[0].description}`;
                    tempEl.textContent = `${temp}℃`;
                    tempEl.style.color = getTempColor(temp);

                    let advice = getClothingAdvice(temp);

                    //雨の日の表示
                    if (data.weather[0].main === 'Rain') {
                        advice += ' ☔ 傘わすれず！';
                    }

                    //服装アドバイスの表示
                    if (adviceEl) {
                        adviceEl.textContent = advice;
                    }
                } catch {
                    statusEl.textContent = '天気取得に失敗しました';
                }
            },
            () => {
                if (!retry) {
                    setTimeout(() => fetchWeather(true), 3000);
                } else {
                    statusEl.textContent = '位置情報が取得できません';
                }
            }
        );
    }


    //天気パネルのテーマを天気によって変更するロジック
    function setWeatherTheme(main) {
        if (!weatherPanel) return;

        weatherPanel.classList.remove(
            'weather--clear',
            'weather--clouds',
            'weather--rain',
            'weather--snow',
            'weather--thunderstorm'
        );

        switch (main) {
            case 'Clear':
                weatherPanel.classList.add('weather--clear');
                break;

            case 'Clouds':
                weatherPanel.classList.add('weather--clouds');
                break;

            case 'Rain':
            case 'Drizzle':
                weatherPanel.classList.add('weather--rain');
                break;

            case 'Snow':
                weatherPanel.classList.add('weather--snow');
                break;

            case 'Thunderstorm':
                weatherPanel.classList.add('weather--rain');
                break;

            default:
                weatherPanel.classList.add('weather--clouds');
                break;
        }
    }

    //アイコン切替ロジック
    function getWeatherIcon(main) {
        switch (main) {
            case 'Clear': return '☀️';
            case 'Clouds': return '☁️';
            case 'Rain':
            case 'Drizzle': return '🌧️';
            case 'Thunderstorm': return '⛈️';
            case 'Snow': return '❄️';
            default: return '🌥️';
        }
    }

    //服装アドバイス
    function getClothingAdvice(temp) {
        if (temp >= 28) return '👕 はんそで！あついよ！';
        if (temp >= 24) return '👕 はんそで＋うすい上着！';
        if (temp >= 20) return '👕 ながそででOK！';
        if (temp >= 16) return '🧥 パーカーきてね！';
        if (temp >= 12) return '🧥 ジャンバーきて！';
        return '🧥 うわぎ着てね！！さむいよ❄️';
    }

    //温度によってカラーチェンジ
    function getTempColor(temp) {
        if (temp >= 28) return '#ff6b6b';
        if (temp >= 20) return '#4dabf7';
        if (temp >= 10) return '#74c0fc';
        return '#adb5bd';
    }

    refreshBtn?.addEventListener('click', fetchWeather);

    //自動アップデートロジック
    function startAutoUpdate() {
        stopAutoUpdate();
        weatherInterval = setInterval(fetchWeather, AUTO_UPDATE_INTERVAL);
    }

    //自動アップデート停止ロジック
    function stopAutoUpdate() {
        if (weatherInterval) {
            clearInterval(weatherInterval);
            weatherInterval = null;
        }
    }

    //ページが読み込まれたら処理がはしる
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            fetchWeather();
            startAutoUpdate();
        }
    });

    fetchWeather();
    startAutoUpdate();
}
