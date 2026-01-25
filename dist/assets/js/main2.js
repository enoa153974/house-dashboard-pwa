import "./style.js";
function initClock() {
  const clockEl = document.getElementById("clock");
  const dateEl = document.getElementById("date");
  if (!clockEl || !dateEl) return;
  const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
  function updateClock() {
    const now = /* @__PURE__ */ new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    clockEl.textContent = `${hours}:${minutes}`;
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const weekday = WEEKDAYS[now.getDay()];
    dateEl.textContent = `${year}/${month}/${day}（${weekday}）`;
  }
  updateClock();
  setInterval(updateClock, 1e3);
}
function initWeather() {
  const API_KEY = "431956e1ae5d6c3bde0cbdbaf7b3102e";
  const statusEl = document.getElementById("weather-status");
  const tempEl = document.getElementById("weather-temp");
  const refreshBtn = document.getElementById("weather-refresh");
  if (!statusEl || !tempEl) return;
  let weatherInterval = null;
  const AUTO_UPDATE_INTERVAL = 30 * 60 * 1e3;
  async function fetchWeather(retry = false) {
    if (!navigator.geolocation) {
      statusEl.textContent = "位置情報が使えません";
      return;
    }
    statusEl.textContent = "天気取得中…";
    tempEl.textContent = "";
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ja&appid=${API_KEY}`
          );
          const data = await res.json();
          statusEl.textContent = `${getWeatherIcon(data.weather[0].main)} ${data.weather[0].description}`;
          tempEl.textContent = `気温は：${Math.round(data.main.temp)}℃です`;
        } catch {
          statusEl.textContent = "天気取得に失敗しました";
        }
      },
      () => {
        if (!retry) {
          setTimeout(() => fetchWeather(true), 3e3);
        } else {
          statusEl.textContent = "位置情報が取得できません";
        }
      }
    );
  }
  function getWeatherIcon(main) {
    switch (main) {
      case "Clear":
        return "☀️";
      case "Clouds":
        return "☁️";
      case "Rain":
      case "Drizzle":
        return "🌧️";
      case "Thunderstorm":
        return "⛈️";
      case "Snow":
        return "❄️";
      default:
        return "🌥️";
    }
  }
  refreshBtn?.addEventListener("click", fetchWeather);
  function startAutoUpdate() {
    stopAutoUpdate();
    weatherInterval = setInterval(fetchWeather, AUTO_UPDATE_INTERVAL);
  }
  function stopAutoUpdate() {
    if (weatherInterval) {
      clearInterval(weatherInterval);
      weatherInterval = null;
    }
  }
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      fetchWeather();
      startAutoUpdate();
    }
  });
  fetchWeather();
  startAutoUpdate();
}
function initGarbage() {
  const commentEl = document.getElementById("garbage-comment");
  if (!commentEl) return;
  const GARBAGE_SCHEDULE = {
    1: "ごみ",
    // 月
    2: "ビン・カン・段ボール",
    // 火
    4: "ごみ",
    // 木
    5: "プラ"
    // 金
  };
  const today = /* @__PURE__ */ new Date();
  const day = today.getDay();
  const garbageType = GARBAGE_SCHEDULE[day];
  if (garbageType) {
    commentEl.textContent = `今日は「${garbageType}」の日です！`;
  } else {
    commentEl.textContent = "今日はゴミの日ではありません";
  }
}
function initMemo() {
  const formEl = document.getElementById("memo-form");
  const inputEl = document.getElementById("memo-input");
  const displayEl = document.getElementById("memo-display");
  const clearBtn = document.getElementById("memo-clear");
  if (!formEl || !inputEl || !displayEl) return;
  const STORAGE_KEY = "house-memo";
  const savedMemo = localStorage.getItem(STORAGE_KEY);
  if (savedMemo) {
    displayEl.textContent = savedMemo;
  }
  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = inputEl.value.trim();
    if (!text) return;
    localStorage.setItem(STORAGE_KEY, text);
    displayEl.textContent = text;
    inputEl.value = "";
  });
  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    displayEl.textContent = "（未設定）";
    inputEl.value = "";
  });
}
function initNav() {
  const pageButtons = document.querySelectorAll(".nav-btn[data-page]");
  pageButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = btn.dataset.page;
      if (!page) return;
      navigator.vibrate?.(50);
      location.href = `/src/pages/${page}.html`;
    });
  });
  const chatBtn = document.getElementById("btnChatGPT");
  chatBtn?.addEventListener("click", () => {
    navigator.vibrate?.(50);
    location.href = "https://chatgpt.com/";
  });
}
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
window.addEventListener("DOMContentLoaded", () => {
  initClock();
  initWeather();
  initGarbage();
  initMemo();
  initNav();
});
