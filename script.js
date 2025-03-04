// Объявление констант
const STORAGE_LABEL_MOVIES = "movies";

// Классы для изменения стилей
const WATCHED_CLASS = "list__element_watched";
const TITLE_WATCHED_CLASS = "list__movie-title_watched";
const REMOVE_BTN_WATCHED_CLASS = "remove-btn_watched";

// Объявление переменных – ссылок на HTML элементы
const inputNode = document.querySelector(".js-movies__input"); // Поле ввода названия фильма
const addBtnNode = document.querySelector(".js-movies__add-btn"); // Кнопка "Добавить"
const movieListNode = document.querySelector(".js-movies__list"); // Список фильмов

// Объявление основной переменной, которая содержит массив фильмов
let movies = loadMoviesFromStorage();

// Отображение фильмов (если были загружены)
renderMovieList();


// ОСНОВНЫЕ ФУНКЦИИ ----------------------------------------------------------------

// 1. Пользователь добавляет фильм
addBtnNode.addEventListener("click", function(){
    // 1. Получаем значение из поля ввода
    const movieTitle = getMovieFromUser(); // Сохраняем введённое название фильма

    if (!movieTitle) { // Если название не введено — выходим из функции
        return;
    }

    // 2. Сохраняем фильм в массив movies
    addMovieToArray(movieTitle); // Передаём название фильма в функцию

    // 3. Очищаем поле ввода
    clearInput();

    // 4. Выводим список фильмов
    renderMovieList();
});

// 2. Отмечаем фильм как просмотренный
movieListNode.addEventListener("change", function(event) { // Добавляем обработчик события на весь список фильмов .js-movies__list
    if (event.target.classList.contains("js-list__checkbox")) { // Если пользователь кликнул на элемент, который имеет класс .js-list__checkbox, то:
        markMovieAsWatched(event); // Отмечаем фильм как просмотренный
    }
});

// 3. Удаляем фильм
movieListNode.addEventListener("click", function(event) { // Добавляем обработчик события на весь список фильмов .js-movies__list
    if (event.target.classList.contains("js-remove-btn")) { // Если пользователь кликнул на элемент, который содержит класс .js-remove-btn, то:
        removeMovie(event); // Удаляем фильм из списка и localStorage
    }
});

// ПОДФУНКЦИИ ----------------------------------------------------------------

// Функции работы с localStorage

// Сохранение добавленных фильмов в localStorage
function saveMoviesToStorage() {
    const moviesString = JSON.stringify(movies); // Создаём переменную, которая хранит список фильмов в виде строки
    localStorage.setItem(STORAGE_LABEL_MOVIES, moviesString);
}

// Загрузка фильмов из localStorage в массив фильмов movies
function loadMoviesFromStorage() {
    const moviesFromStorageString = localStorage.getItem(STORAGE_LABEL_MOVIES); // Создаём переменную, которая хранит значения сохранённых в localStorage расходов в виде строки
    const moviesFromStorage = JSON.parse(moviesFromStorageString); // // Создаём переменную, которая хранит в себе массив, собранный из localStorage, и превращаем строку в массив

    // Проверка на то, что массив из localStorage является массивом:
    if (Array.isArray(moviesFromStorage)) {
        return moviesFromStorage; // Если список фильмов является массивом, возвращает список фильмов
    } else {
        return []; // Если список фильмов не является массивом, возвращает пустой массив
    }
}


// 1. Получаем значение из поля ввода
function getMovieFromUser() {
    // Проверяем, что поле ввода не пустое (если пустое, то функция не работает)
    if (!inputNode.value) {
        return;
    }
    
    return inputNode.value.trim(); // Функция возвращает значение, введённое в поле ввода (метод .trim() убирает лишние пробелы с двух концов)
}

// 2. Очищаем поле ввода
function clearInput() {
    inputNode.value = "";
}

// 3. Собираем данные от пользователя и сохраняем их в массив фильмов movies
function addMovieToArray(title) {
    // 3. Из полученных переменных собираем объект newMovie, который состоит из двух полей – title и watched
    const newMovie = { title, watched: false };

    // 4. Сохраняем объект с названием и статусом просмотра в массив фильмов movies
    movies.push(newMovie);

    // 5. Сохраняем добавленный фильм в localStorage
    saveMoviesToStorage();
}


// 4. Выводим список фильмов
function renderMovieList() {
    // 1. Очищаем список перед добавлением новых элементов, чтобы выводился только актуальный список фильмов
    movieListNode.innerHTML = "";

    // 2. Проходимся по каждому объекту (фильму) массива movies
    movies.forEach(movie => {
        // 2.1 Для каждого фильма из списка создаём <li> элемент и добавляем ему классы
        const newMovie = document.createElement("li");
        newMovie.classList.add("js-list__element", "list__element");

        // 2.2 Добавляем разметку внутрь <li>
        newMovie.innerHTML = `
            <label class="list__content">
                <input class="js-list__checkbox list__checkbox" type="checkbox" ${movie.watched ? "checked" : ""}>
                <span class="js-list__movie-title list__movie-title">${movie.title}</span>
            </label>
            <img
                class="js-remove-btn remove-btn"
                src="resources/remove_btn.svg"
                alt="Вычеркнуть фильм"
            >`;
        
        // 2.3 Добавляем <li> в список
        movieListNode.appendChild(newMovie);
    });

    // После рендеринга списка проверяем просмотренные фильмы
    movies.forEach((movie, index) => {
        if (movie.watched) {
            // Находим соответствующий элемент списка
            const movieElement = movieListNode.children[index];
            applyWatchedMovieStyles(movieElement);
        }
    });
}

// Меняем стили просмотренных фильмов
function applyWatchedMovieStyles(eventOrElement) {
    // Если передан `event`, то берём `event.target`, иначе работаем с переданным элементом
    // 1. Находим родительский <li>, т.к. менять нужно не только чекбокс, но и весь элемент
    const watchedMovie = eventOrElement.target ? getParent(eventOrElement.target) : eventOrElement;

    if (!watchedMovie) return; // Если элемента нет — выходим

    // 2. Меняем фон
    watchedMovie.classList.add(WATCHED_CLASS);

    // 3. Находим span с названием фильма
    const watchedMovieTitle = watchedMovie.querySelector(".js-list__movie-title");

    // 4. Зачёркиваем название
    watchedMovieTitle.classList.add(TITLE_WATCHED_CLASS);

    // 5. Находим кнопку удаления
    const removeBtn = watchedMovie.querySelector(".js-remove-btn");

    // 6. Меняем стиль кнопки
    removeBtn.classList.add(REMOVE_BTN_WATCHED_CLASS);
}

// Удаляем стили просмотренных фильмов
function removeWatchedMovieStyles(event) {
    // 1. Находим родительский <li>, т.к. менять нужно не только чекбокс, но и весь элемент
    const watchedMovie = getParent(event.target);

    // 2. Меняем фон
    watchedMovie.classList.remove(WATCHED_CLASS);

    // 3. Находим span с названием фильма
    const watchedMovieTitle = watchedMovie.querySelector(".js-list__movie-title");

    // 4. Зачёркиваем название
    watchedMovieTitle.classList.remove(TITLE_WATCHED_CLASS);

    // 5. Находим кнопку удаления
    const removeBtn = watchedMovie.querySelector(".js-remove-btn");

    // 6. Меняем стиль кнопки
    removeBtn.classList.remove(REMOVE_BTN_WATCHED_CLASS);
}

// Удаляем фильм из списка
function removeMovie(event) {
    // 1. Находим родительский <li>, т.к. менять нужно не только чекбокс, но и весь элемент
    const removedMovie = getParent(event.target);

    // 2. Находим span с названием фильма
    const removedMovieTitle = getMovieTitle(removedMovie);

    // 3. По названию фильма yаходим индекс фильма в массиве
    const index = movies.findIndex(function(movie) { // Метод .findIndex перебирает массив фильмов один за другим
        return movie.title === removedMovieTitle; // Содержит ли элемент заголовок того элемента, по которому кликнули?
    });
    
    // 4. Если нашли фильм, то:
    if (index !== -1) {
        movies.splice(index, 1); // 4.1 Удаляем фильм из массива movies
        saveMoviesToStorage(); // 4.2 Обновляем localStorage
    }

    // 5. Удаляем фильм из DOM
    removedMovie.remove();
}

// Отмечаем фильм как просмотренный
function markMovieAsWatched() {
    // 1. Находим родительский <li>, т.к. менять нужно не только чекбокс, но и весь элемент
    const watchedMovie = getParent(event.target);

    // 2. Получаем название фильма из выбранного элемента
    const watchedMovieTitle = getMovieTitle(watchedMovie);

    // 3. По названию фильма находим индекс фильма в массиве
    const index = movies.findIndex(function(movie) { // Метод .findIndex перебирает массив фильмов один за другим
        return movie.title === watchedMovieTitle; // Содержит ли элемент заголовок того элемента, по которому кликнули?
    });

    // 4. Если нашли фильм, то:
    if (index !== -1) {
        movies[index].watched = !movies[index].watched; // 4.1 Переключаем статус с false на true и наоборот
        saveMoviesToStorage(); // 4.2 Обновляем localStorage

        // 5. Применяем или убираем стили в зависимости от статуса
        if (movies[index].watched) {
            applyWatchedMovieStyles(event);
        } else {
            removeWatchedMovieStyles(event);
        }
    }
}

// Получаем название фильма
function getMovieTitle(movie) {
    // Находим span с фильмом и получаем его название
    const movieTitle = movie.querySelector(".js-list__movie-title").textContent.trim();

    // Возвращаем название фильма
    return movieTitle;
}

// Находим родительский <li>
function getParent(element) {
    return element.closest(".js-list__element");
}

// Применяем стили к просмотренным фильмам после загрузки страницы

function applySavedWatchedMovies() {
    movies.forEach(movie => {
        if (movie.watched) {
            const movieElements = document.querySelectorAll(".js-list__element");

            movieElements.forEach(element => {
                const titleElement = element.querySelector(".js-list__movie-title");

                if (titleElement.textContent.trim() === movie.title) {
                    applyWatchedMovieStyles({ target: element});
                }
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", applySavedWatchedMovies);