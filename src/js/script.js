window.addEventListener('DOMContentLoaded', () => {
    'use strict';
    /*получение всех модулей*/
    let tabs = require('./parts/tabs')
    let modal = require('./parts/modal')
    let slider = require('./parts/slider')
    let form = require('./parts/form')
    let timer = require('./parts/timer')
    let calc = require('./parts/calc')
    /*вызов всех модулей независимо друг от друга*/
    tabs()
    modal()
    slider()
    form()
    timer()
    calc()
});