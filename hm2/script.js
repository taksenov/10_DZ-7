// ДЗ 2:
// К страничке из предыдущего задания необходимо добавить форму с текстовыми полями
// и кнопкой "добавить".
// Список текстовых полей:
// - имя
// - значение
// - срок годности (количество дней)
//
// После нажатия на кнопку "добавить" должна быть создана (и добавлена в таблицу)
// новая cookie с указанными параметрами. Обратите внимание,
// что в поле "срок годности" указывается количество дней (начиная с текущего),
// на протяжении которых будет доступна cookie.
//
// После добавление cookie, значения текстовых полей формы должны быть очищены.
// Если какое-то из полей формы не заполнено, то, при нажатии на кнопку "добавить",
// cookie не должна быть создана, а на экран должен быть выведен alert с
// предупреждением "Заполните все поля формы".
// Так же заметьте, что при работе с формой и таблицей, не должно быть
// перезагрузок страницы
// ===
// Установка HTTP-сервера:
// 1) npm install http-server -g
// Запуск HTTP-сервера:
// 2) http-server hm1 -p 7777 -a 127.0.0.1
// 3) http://localhost:7777/
// ===

// Установка переменных --------------------------------------------------------
let cookieTable = document.getElementById('cookieTable');
let addNewCookieBtn = document.getElementById('addNewCookieBtn');
let cookieInputName = document.getElementById('cookieInputName')
let cookieInputValue = document.getElementById('cookieInputValue')
let cookieInputExpires = document.getElementById('cookieInputExpires')
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
function setСookie ( name, value, expires, path ) {
    let cookieString = name + '=' + escape ( value );
    if ( typeof expires === 'string' ) {
        expires = +expires; //convert from string to number
    }
    if (typeof expires === 'number' && expires) {
        let day = new Date();
        day.setDate(day.getDate() + expires);
        expires = day;
        cookieString += "; expires=" + expires;
    }
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
                            ${content.cookieExpires}
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
* устанавливает срок жизни куки, значение и имя от куки в объект,
* применяется для сокращения количества параметров для функции внедрения в DOM TBODY
* @param {string} name имя куки
* @param {string} value значение куки
* @param {string} expires  срок жизни куки в днях
* @return {object} currentCookieObject меняется через замыкание
*/
// todo изменить поведение устанавливает знвчяения из формы ввода!
function setObjectCookie(name, value, expires) {
    currentCookieObject.cookieName = name;
    currentCookieObject.cookieValue = value;
    currentCookieObject.cookieExpires = expires;
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
// добавление куки на страницу(DOM) и в document.cookie из формы
function addNewCookieFromForm(e, name, value, expires) {

    if () {
        //todo вывести предупреждение, что в поле expires не число и куки будет добалена только сессионнная
    }
    if ( !name || !value || !expires ) {
        alert('Необходимо заполнить все поля формы!');
        return false;
    } else {
        setObjectCookie(name, value, expires);
        addNewTR(currentCookieObject, cookieTable);
        setСookie(name,value,expires,'/');
        cookieInputName.value = '';
        cookieInputValue.value = '';
        cookieInputExpires.value = '';
    }
    return true;
} // addNewCookieFromForm
// обработчики событий ---------------------------------------------------------

// обработка событий на странице -----------------------------------------------
// удаление куки через делегирование
cookieTable.addEventListener(
    'click',
    (e) => { finalDeleteCookie(e) }
);
addNewCookieBtn.addEventListener(
    'click',
    (e) => { addNewCookieFromForm(e, cookieInputName.value, cookieInputValue.value, cookieInputExpires.value) }
);
// обработка событий на странице -----------------------------------------------
