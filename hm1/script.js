// ДЗ 1:
// Создать страницу, которая выводит все имеющиеся cookie в виде таблицы (имя, значение).
// Для каждой cookie в таблице, необходимо добавить кнопку "удалить",
// При нажатии на "удалить", на экран должен быть выведен confirm с текстом
// "Удалить cookie с именем …?". Вместо … необходимо подставить имя удаляемой cookie.
// Если пользователь ответил положительно, то соответствующая cookie должна быть удалена.
// ===
// Установка HTTP-сервера:
// 1) npm install http-server -g
// Запуск HTTP-сервера:
// 2) http-server hm1 -p 7777 -a 127.0.0.1
// 3) http://localhost:7777/
// ===

// Установка переменных --------------------------------------------------------
let cookieTable = document.getElementById('cookieTable');
let cookieArray = [];
let cookieNameArray = [];
let currentCookieObject = {};
// Установка переменных --------------------------------------------------------

// впомогательные функции ------------------------------------------------------
/**
* Ищет нужный класс для выбранного таргета
* @param  { DOMTokenList collection of the class attributes} classList коллекция всех классов элемента
* @param  {string} findedClass искомый класс
* @return {boolean}             если класс найден то true иначе false
*/
function findNeedClassName(classList, findedClass) {
    if ( classList.length !== 0 ) {
        for (let i=0; i < classList.length; i++ ) {
            if (classList[i] === findedClass ) {
                return true;
            }
        }
    }
    return false;
} //findNeedClassName
// впомогательные функции ------------------------------------------------------

// Подготовительная работа с cookie --------------------------------------------
function setСookie ( name, value, path ) {
    let cookieString = name + "=" + escape ( value );
    if ( path ) {
        cookieString += "; path=" + escape ( path );
    }
    document.cookie = cookieString;
} // setСookie

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
} // getCookie

function deleteCookie(name) {
    let cookieDate = new Date ( );
    cookieDate.setTime ( cookieDate.getTime() - 1 );
    document.cookie = name += "=; expires=" + cookieDate.toGMTString();
} // deleteCookie

/**
* addNewTR функция добавляет строку в таблицу
* @param {object} content   добавляемый в таблицу контент
* @param {DOM element} parent    ссылка на родительскую таблицу взятая из DOM
* @return {boolean} return false;
*/
function addNewTR(content, parent) {
    let tBody = parent.tBodies[0];
    var newTR = document.createElement('tr');
    newTR.innerHTML =  `<td>
                            ${content.cookieName}
                        </td>
                        <td>
                            ${content.cookieValue}
                        </td>
                        <td>
                            <button class="btn btn-default deleteCookieBtn" id="${content.cookieName}">
                                Delete
                                </button>
                        </td>
                        `;
    tBody.appendChild(newTR);
    return false;
} // addNewTR

/**
* устанавливает значение и имя от куки в объект,
* применяется для сокращения количества параметров для функции внедрения в DOM TBODY
* @param {string} name имя куки\
* @return {object} изменяет значения глобальной переменной объекта, через замыкание
*/
function setObjectCookie(name) {
    currentCookieObject.cookieName = name;
    currentCookieObject.cookieValue = getCookie(name);
} //setObjectCookie
// Подготовительная работа с cookie --------------------------------------------

// обработчики событий ---------------------------------------------------------
// окончательное удаление куки из DOM и из document.cookie
function finalDeleteCookie(e) {
    let element = e.target;
    let deletedCookieName = element.id;
    let needClassName = false;
    needClassName = findNeedClassName(element.classList, 'deleteCookieBtn');

    if ( needClassName && element.tagName === 'BUTTON' ) {
        let deleteCurrent = confirm(`Удалить cookie с именем ${element.id}?`);
        if ( deleteCurrent ) {
            deleteCookie(deletedCookieName);
            element.parentNode.parentNode.innerHTML = '';
        }
        return false;
    }
} // finalDeleteCookie
// обработчики событий ---------------------------------------------------------

// Добавить 20 cookie -- синтетический пример ----------------------------------
// добавить куки в document
for (let i=0; i<20; i++) {
    setСookie('cookieName'+i,'cookieValue'+Date.now(),'/');
}

// создать массив со всеми куками документа
cookieArray = document.cookie.split('; ');

// наполнить массив только именами всех куки
for (let i=0; i<cookieArray.length; i++) {
    cookieNameArray[i] = cookieArray[i].substring(cookieArray[i], cookieArray[i].indexOf('='));
}

// вставить все куки из document в DOM
for (let i=0; i<cookieNameArray.length; i++) {
    setObjectCookie(cookieNameArray[i]);
    addNewTR(currentCookieObject, cookieTable);
}
// Добавить 20 cookie -- синтетический пример ----------------------------------

// обработка события удаления куки из таблицы и из документа -------------------
// удаление куки через делегирование
cookieTable.addEventListener(
    'click',
    (e) => { finalDeleteCookie(e) }
);
// обработка события удаления куки из таблицы и из документа -------------------
