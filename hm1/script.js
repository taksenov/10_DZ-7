// ДЗ 1:
//
// Создать функцию `timer`.
// Функция `timer` должна возвращать новый промис.
// Функция `timer` принимает 1 аргумент - количество миллисекунд, через которые промис должен перейти в состояние `fulfilled`.
// Пример использования:
// timer(3000).then(() => console.log('я вывелась через 3 секунды'))
// Запрещено использование любых библиотек (включая jQuery) и фреймворков.

/**
 * функция возвращает промис, по истечении заданного времение
 * @param { numberInt } заданное время ожидания в милисекундах
 * @return { promise } возвращает промис в случае когда внутри таймера resolve()
 */
function timer(timeOut) {
    // проверка входного параметра
    function isInteger(num) {
        return (num ^ 0) === num;
    } //isInteger
    if ( !isInteger(timeOut) || arguments.length === 0 ) {
        throw new Error('UNKNOWN_PARAM')
    }; // проверка входного параметра

    // вывод функции
    return new Promise(
        ( resolve, reject ) => { setTimeout( () => { resolve(); }, timeOut ); }
    );
}; // timer

//вызов таймера
try {
    timer(4000).then(() => console.log('прошло всего 4 секунды'));
} catch (e) {
    if (e.message === 'UNKNOWN_PARAM') {
        console.error('Для функции timer, задан неверный аргумент. Используйте целые числа, указывайте время в милисекундах.');
    } else {
        console.error('При выполнении функции timer, возникла ошибка.');
    }
}
