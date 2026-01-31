import '../styles/style.scss';

/* =========================
 * Data
 * ========================= */
const RECIPES = [
    {
        id: 'recipe-001',
        title: '照り焼きチキン',
        summary: '醤油2：みりん2：砂糖1 / 皮目から',
        tags: ['定番', 'フライパン'],
        ingredients: ['鶏もも肉', 'しょうゆ', 'みりん', '砂糖'],
        steps: ['皮目から焼く', '調味料を絡める'],
        sourceUrl: 'onenote://example'
    },
    {
        id: 'recipe-002',
        title: '神パスタ',
        summary: 'オイル多め・にんにく焦がさない',
        tags: ['簡単', '10分'],
        ingredients: ['パスタ', 'にんにく', 'オリーブオイル'],
        steps: ['にんにくを弱火で熱する', 'オイルと絡める'],
        sourceUrl: ''
    }
];

/* =========================
 * Render
 * ========================= */
function renderRecipeList(recipes) {
    const listEl = document.querySelector('.recipe-list__items');
    listEl.innerHTML = '';

    recipes.forEach(recipe => {
        const li = document.createElement('li');
        li.className = 'recipe-card';

        const button = document.createElement('button');
        button.className = 'recipe-card__button';
        button.type = 'button';
        button.dataset.recipeId = recipe.id;

        const title = document.createElement('span');
        title.className = 'recipe-card__title';
        title.textContent = recipe.title;

        const tagsWrap = document.createElement('span');
        tagsWrap.className = 'recipe-card__tags';

        recipe.tags.forEach(tag => {
            const tagEl = document.createElement('span');
            tagEl.className = 'recipe-tag';
            tagEl.textContent = tag;
            tagsWrap.appendChild(tagEl);
        });

        button.appendChild(title);
        button.appendChild(tagsWrap);
        li.appendChild(button);
        listEl.appendChild(li);
    });
}

function renderRecipeDetail(recipe) {
    document.querySelector('.recipe-detail__title').textContent = recipe.title;
    document.querySelector('.recipe-summary').textContent = recipe.summary;

    const tagList = document.querySelector('.recipe-tags');
    tagList.innerHTML = '';
    recipe.tags.forEach(tag => {
        const li = document.createElement('li');
        li.className = 'recipe-tag';
        li.textContent = tag;
        tagList.appendChild(li);
    });

    const ingredientsSection = document.querySelector('.recipe-ingredients');
    const ingredientList = document.querySelector('.ingredient-list');
    ingredientList.innerHTML = '';

    if (recipe.ingredients.length === 0) {
        ingredientsSection.classList.add('is-hidden');
    } else {
        ingredientsSection.classList.remove('is-hidden');
        recipe.ingredients.forEach(item => {
            const li = document.createElement('li');
            li.className = 'ingredient-item';
            li.textContent = item;
            ingredientList.appendChild(li);
        });
    }

    const stepsSection = document.querySelector('.recipe-steps');
    const stepList = document.querySelector('.step-list');
    stepList.innerHTML = '';

    if (recipe.steps.length === 0) {
        stepsSection.classList.add('is-hidden');
    } else {
        stepsSection.classList.remove('is-hidden');
        recipe.steps.forEach(step => {
            const li = document.createElement('li');
            li.className = 'step-item';
            li.textContent = step;
            stepList.appendChild(li);
        });
    }

    const sourceLink = document.querySelector('.recipe-source__link');
    if (recipe.sourceUrl) {
        sourceLink.href = recipe.sourceUrl;
        sourceLink.classList.remove('is-hidden');
    } else {
        sourceLink.classList.add('is-hidden');
    }
}

/* =========================
 * レシピタイマー関数
 * ========================= */
function initRecipeTimer() {
    const finishSound = new Audio('/sounds/alarm.mp3');
    finishSound.loop = true;
    finishSound.preload = 'auto';
    const timerEl = document.querySelector('.recipe-timer');
    const displayEl = document.querySelector('.recipe-timer__display');
    const controlsEl = document.querySelector('.recipe-timer__controls');

    if (!timerEl || !displayEl || !controlsEl) return;

    let timerId = null;
    let remainingSeconds = 0;

    function updateDisplay(seconds) {
        const min = String(Math.floor(seconds / 60)).padStart(2, '0');
        const sec = String(seconds % 60).padStart(2, '0');
        displayEl.textContent = `${min}:${sec}`;
    }

    function stopSound() {
        finishSound.pause();
        finishSound.currentTime = 0;
    }
    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
        }
        timerEl.classList.remove('is-running');
         stopSound();
    }

    function resetTimer() {
        stopTimer();
        remainingSeconds = 0;
        updateDisplay(0);
        timerEl.classList.remove('is-finished');
    }

    function startTimer(minutes) {
        stopTimer();

        remainingSeconds = minutes * 60;
        updateDisplay(remainingSeconds);


        timerId = setInterval(() => {
            remainingSeconds--;
            updateDisplay(remainingSeconds);

            if (remainingSeconds <= 0) {
                stopTimer();
                timerEl.classList.add('is-finished');

                // 🔔 終了音
                finishSound.currentTime = 0;
                finishSound.play().catch(() => {
                    // 再生失敗しても落とさない
                });
            }
        }, 1000);
    }

    controlsEl.addEventListener('click', (e) => {
        const minuteBtn = e.target.closest('[data-minutes]');
        const stopBtn = e.target.closest('[data-action="stop"]');
        const resetBtn = e.target.closest('[data-action="reset"]');

        if (minuteBtn) startTimer(Number(minuteBtn.dataset.minutes));
        if (stopBtn) stopTimer();
        if (resetBtn) resetTimer();
    });

    updateDisplay(0);
}

/* =========================
 * Init
 * ========================= */
document.addEventListener('DOMContentLoaded', () => {
    const recipeList = document.querySelector('.recipe-list');
    const recipeDetail = document.querySelector('.recipe-detail');
    const recipeTimer = document.querySelector('.recipe-timer');
    const backButton = document.querySelector('.recipe-back');
    const recipeListItems = document.querySelector('.recipe-list__items');

    renderRecipeList(RECIPES);
    initRecipeTimer();

    recipeListItems.addEventListener('click', (e) => {
        const button = e.target.closest('.recipe-card__button');
        if (!button) return;

        const recipe = RECIPES.find(r => r.id === button.dataset.recipeId);
        if (!recipe) return;

        renderRecipeDetail(recipe);

        recipeList.classList.add('is-hidden');
        recipeDetail.classList.remove('is-hidden');
        recipeTimer.classList.remove('is-hidden');
    });

    backButton.addEventListener('click', () => {
        recipeDetail.classList.add('is-hidden');
        recipeList.classList.remove('is-hidden');
        recipeTimer.classList.add('is-hidden');
    });
});