/*калькулятор*/
function calc() {
    /*получаем инпуты, значение счетчика, и определяем переменные для записи в них значений из инпутов*/
    let persons = document.querySelectorAll('.counter-block-input')[0]
    let restDays = document.querySelectorAll('.counter-block-input')[1]
    let place = document.getElementById('select')
    let totalValue = document.getElementById('total')
    let personsSum = 0
    let daysSum = 0
    let total = 0
    /*делаем значение счетчика изначально равным 0*/
    totalValue.innerHTML = 0
    /*обработчик ввода количества людей в инпут*/
    persons.addEventListener('change', function () {
        /*закидываем значение в инпуте в переменную*/
        personsSum = +this.value
        /*формула расчета счетчика без учета графы place*/
        total = (daysSum + personsSum)*4000
        if (restDays.value === '' || persons.value === '') {
            totalValue.innerHTML = 0
        } else {
            totalValue.innerHTML = total
        }
    })
    /*обработчик ввода количества дней в инпут*/
    restDays.addEventListener('change', function () {
        daysSum = +this.value
        total = (daysSum + personsSum)*4000
        if (persons.value === '' || restDays.value === '') {
            totalValue.innerHTML = 0
        } else {
            totalValue.innerHTML = total
        }
    })
    /*обработчик изменения параметра place и окончательный подсчет счетчика*/
    place.addEventListener('change', function () {
        if (persons.value === '' || restDays.value === '') {
            totalValue.innerHTML = 0
        } else {
            let a = total
            totalValue.innerHTML = a * this.options[this.selectedIndex].value
        }
    })
}
module.exports = calc