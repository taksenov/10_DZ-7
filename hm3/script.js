// ДЗ 3 (по желанию): Взять результат ДЗ по теме DOM Events (страница с
// кнопкой для создания div'ов, которые можно перетаскивать при помощи D&D)
// Добавить на страницу кнопку "сохранить". При нажатии на данную кнопку,
// количество, цвет и позиция всех div'ов должны быть сохранены в одну cookie.
// После перезагрузки страницы, необходимо достать эту информацию из cookie
// и восстановить все div'ы (с их размерами, позицией и цветами)
//
// =============================================================================
// ИНФОРМАЦИЯ О СТАРОМ ДЗ ( https://github.com/taksenov/08_DZ-5/tree/master/hm2 )
// =============================================================================
//
// ===
// Установка HTTP-сервера:
// 1) npm install http-server -g
// Запуск HTTP-сервера:
// 2) http-server hm1 -p 7777 -a 127.0.0.1
// 3) http://localhost:7777/
// ===

let addNewDivBtn = document.getElementById('add_new_div_btn');
let saveDivsInCookieBtn = document.getElementById('saveDivsInCookie');
let restoreDivsFromCookieBtn = document.getElementById('restoreDivsFromCookie');
let parentDndBlock = document.getElementById('workspace__board_id');
let minWidth = 50;
let maxWidth = 250;
let minHeigth = 50;
let maxHeigth = 250;

// support functions
function getCoords(elem) {
    // (1)
    let box = elem.getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    // (2)
    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    // (3)
    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;

    // (4)
    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;

    return {
        top: top,
        left: left
    };
}; // getCoords

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

// Возвращает случайное целое число между min (включительно) и max (не включая max)
// Использование метода Math.round() даст вам неравномерное распределение!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
} // getRandomInt
function getRandomHexColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
} // getRandomHexColor
// support functions

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

// handler functions
function showShadows(e) {
    // let element = this;
    let element = e.target;
    let needClassName = false;
    needClassName = findNeedClassName(element.classList, 'dnd_block');
    if ( needClassName && element.tagName === 'DIV' ) {
        element.style.WebkitBoxShadow = '0px 0px 44px 10px rgba(71,70,71,0.5)';
        element.style.MozBoxShadow = '0px 0px 44px 10px rgba(71,70,71,0.5)';
        element.style.boxShadow = '0px 0px 44px 10px rgba(71,70,71,0.5)';
    }
} // showShadows

function unShowShadows(e) {
    // let element = this;
    let element = e.target;
    let needClassName = false;
    needClassName = findNeedClassName(element.classList, 'dnd_block');
    // console.log('tagName',element.tagName);
    // console.log('className',element.className);

    if ( needClassName && element.tagName === 'DIV' ) {
        element.style.WebkitBoxShadow = '';
        element.style.MozBoxShadow = '';
        element.style.boxShadow = '';
    }
} // unShowShadows

function dragAndDropBlock(e, parent) {

    // Закешируем таргет в перменную
    let element = e.target;
    let needClassName = false;
    needClassName = findNeedClassName(element.classList, 'dnd_block');

    // Основное условие при котором отработает аккордион
    if ( needClassName && element.tagName === 'DIV' ) {
        let coords = getCoords(element);
        let shiftX = e.pageX - coords.left;
        let shiftY = e.pageY - coords.top;

        element.style.position = 'absolute';

        parent.appendChild(element);
        // moveAt(e);
        moveAt(element);

        element.style.zIndex = 1000; // над другими элементами

        function moveAt(e) {
            element.style.left = e.pageX - shiftX + 'px';
            element.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        element.onmouseup = function() {
            document.onmousemove = null;
            element.onmouseup = null;
        };
        element.ondragstart = function() {
            return false;
        };
    }


} //dragAndDropBlock

function addNewDiv(e, parent) {
    let element = this;
    let newDiv = document.createElement('div');
    newDiv.className = 'dnd_block';
    newDiv.style.height = getRandomInt(minHeigth, maxHeigth) + 'px';
    newDiv.style.width = getRandomInt(minWidth, maxWidth) + 'px';
    newDiv.style.top = getRandomInt(50, 600) + 'px';
    newDiv.style.left = getRandomInt(50, 1200) + 'px';
    newDiv.style.backgroundColor = getRandomHexColor();
    newDiv.style.zIndex = 20;
    parent.appendChild(newDiv);
} // addNewDiv

function saveDivsToCookie(e, parent) {
    setСookie ( 'divs', parent.innerHTML, 5, '/' );
} // saveDivsToCookie

function restoreDivsFromCookie(e, parent) {
    parent.innerHTML = '';
    parent.innerHTML = getCookie('divs');
    deleteCookie('divs');
} // restoreDivsFromCookie

// handler functions

// event listeners
parentDndBlock.addEventListener('mousedown',function(e) { dragAndDropBlock(e, parentDndBlock) } );
parentDndBlock.addEventListener('mouseover',showShadows);
parentDndBlock.addEventListener('mouseout',unShowShadows);
addNewDivBtn.addEventListener('click',function(e) { addNewDiv(e, parentDndBlock) });
saveDivsInCookieBtn.addEventListener('click', (e)=>{saveDivsToCookie(e, parentDndBlock)});
restoreDivsFromCookieBtn.addEventListener('click', (e)=>{restoreDivsFromCookie(e, parentDndBlock)});

// event listeners
