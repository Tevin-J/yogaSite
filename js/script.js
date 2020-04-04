window.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /*ТАБЫ*/
    /*мы должны получить со страницы блоки табов, их родительский блок и блок с контентом табов, чтоб обрабатывать их
    появление и переключение в зависимости от того, на какой таб кликнут*/
    let tab = document.querySelectorAll('.info-header-tab');
    let info = document.querySelector('.info-header');
    let tabContent = document.querySelectorAll('.info-tabcontent');

    let hideTabContent = (a) => { /*эта ф-я нужна для первой отрисовки страницы,чтоб на ней был контент только 1-го таба*/
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide')
        }
    };
    hideTabContent(1);
    let showTabContent = (b) => {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show')
        }
    };
    info.addEventListener('click', (e) => {
        let target = e.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i < tab.length; i++) {
                if (target === tab[i]) {
                    hideTabContent(0); /*стираем все таб контенты*/
                    showTabContent(i); /*отрисовываем таб контент, на таб которого кликнули*/
                    break
                }
            }
        }
    });

    /*ТАЙМЕР*/
    let deadline = '2020-09-31'; /*дата до которой считает таймер*/

    let getTimeRemaining = (endtime) => {
        let t = Date.parse(endtime) - Date.parse(new Date()); /*получаем разницу от дедлайна и датой-временем
        в настоящий момент времени в милисекундах*/
        if (t < 0) { /*обнуляем счетчик если дедлайн уже прошел*/
            t = 0
        }
        let seconds = Math.floor((t/1000)%60);
        let minutes = Math.floor((t/1000/60)%60);
        let hours = Math.floor((t/(1000*60*60)));

        return {
            total: t,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
    };
    let setClock = (id, endtime) => {
        let timer = document.getElementById(id); /*получаем блок таймера и его дочерние элементы*/
        let hours = timer.querySelector('.hours');
        let minutes = timer.querySelector('.minutes');
        let seconds = timer.querySelector('.seconds');

        let timeInterval = setInterval(updateClock, 1000); /*каждую секунду запускаем updateClock*/

        function updateClock() {
            let t = getTimeRemaining(endtime);

            hours.textContent = padNum(t.hours);
            minutes.textContent = padNum(t.minutes);
            seconds.textContent = padNum(t.seconds);

            function padNum(num) { /*ф-я padStart заполняет текущую строку другой строкой так, что итоговая строка
            достигает заданной длины*/
                return num.toString().padStart(2, '0') /*первый аргумент - сколько всего знаков в строке, второй -
                что добавить чтоб заполнить строку до нужной длины*/
            }

            if (t.total <= 0) { /*если кол-во оставшихся до дедлайна милисекунд истекло, выключаем setInterval*/
                clearInterval(timeInterval)
            }
        }
    };
    setClock('timer', deadline);

    /*Модальное окно*/
    /*получаем элементы кнопки для показа модального окна, блок с модальным окном, и элемента кнопки закрытия окна*/
    let openOverlay = document.querySelector('.more');
    let overlay = document.querySelector('.overlay');
    let closeOverlay = document.querySelector('.popup-close');

    openOverlay.addEventListener('click', function() {
        overlay.style.display = 'block'; /*показываем модальное окно на странице*/
        this.classList.add('more-splash');
        document.body.style.overflow = 'hidden' /*делаем невозможной прокрутку страницы пока показано модальное окно*/
    });

    closeOverlay.addEventListener('click', () => {
        overlay.style.display = 'none'; /*скрываем модальное окно со страницы*/
        openOverlay.classList.remove('more-splash');
        document.body.style.overflow = '' /*возвращаем прокрутку страницы*/
    });

    /*ФОРМА Модального окна и Контактов с помощью промисов*/
    /*сообщения которые будут появляться при ответах с сервера*/
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся!',
        failure: 'Что-то пошло не так'
    };
    /*получаем формы и их инпуты*/
    let form = document.querySelector('.main-form');
    let contactForm = document.querySelector('#form');
    let inputs = document.getElementsByTagName('input');
    /*создаем новый блок, в который будем помещать сообщение, который будет вылезать после отправки формы*/
    let statusMessage = document.createElement('div');
    statusMessage.classList.add('status');
    function sendForm(element) {
        /*вешаем обработчик отправки формы (submit) не на кнопку, а на всю форму!*/
        element.addEventListener('submit', function(event) {
            /*отменяем стандартное поведение формы перезагружать страницу при сабмите*/
            event.preventDefault();
            /*когда происходит сабмит, вставляем statusMessage в конец родительского блока*/
            element.appendChild(statusMessage);
            /*с помощью FormData получаем данные, которые пользователь ввел в форме в виде ключ-значение*/
            let formData = new FormData(element);
            /*чтоб перевести эти данные в JSON, создадим пустой {} и с помощью forEach закинем в него все данные {}*/
            let obj = {};
            formData.forEach((value, key) => {
                obj[key] = value
            });
            /*превратим {} в JSON при помощи stringify и отправим его на сервер*/
            let json = JSON.stringify(obj);
            function postData(data) {
                /*создаем промис чтоб последовательно идти по скрипту и не создавать ад колбеков*/
                return new Promise(function (resolve, reject) {
                    /*создаем, настраиваем и отправляем запрос*/
                    let request = new XMLHttpRequest();
                    request.open('POST', 'server.php');
                    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    /*обрабатываем состояние запроса и относительно него идем в then или в catch*/
                    request.onreadystatechange = function() {
                        if (request.readyState < 4) {
                            resolve()
                        } else if (request.readyState === 4 && request.status === 200 && request.status < 300) {
                            resolve()
                        } else {
                            reject()
                        }
                    };
                    request.send(data);
                })
            }
            /*после сабмита зачищаем инпуты*/
            function clearInput() {
                for (let i=0; i < inputs.length; i++) {
                    inputs[i].value = ''
                }
            }
            postData(json)
                .then(() => statusMessage.textContent = message.loading)
                .then(() => statusMessage.textContent = message.success)
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => clearInput())
        })
    }
    sendForm(form);
    sendForm(contactForm)

    /*СЛАЙДЕР*/
    /*текущий слайдер на странице*/
    let slideIndex = 1;
    /*получаем слайды, кнопки взаимодействия со слайдером и обертку слайдера*/
    let slides = document.querySelectorAll('.slider-item');
    let prev = document.querySelector('.prev');
    let next = document.querySelector('.next');
    let dotsWrap = document.querySelector('.slider-dots');
    let dots = document.querySelectorAll('.dot');
    showSlides(slideIndex);
    /*ф-я которая будет скрывать все слайды кроме необходимого*/
    function showSlides(n) {
        /*проверка чтоб с последнего слайда переходить на первый и с первого на последний*/
        if (n > slides.length) {
            slideIndex = 1
        }
        if (n < 1) {
            slideIndex = slides.length
        }
        /*скроем все слайды со страницы и сделаем точки неактивными*/
        slides.forEach((item) => item.style.display = 'none');
        dots.forEach((item) => item.classList.remove('dot-active'));
        /*нужный слайд показываем и делаем соответствующую точку активной*/
        slides[slideIndex - 1].style.display = 'block';
        dots[slideIndex - 1].classList.add('dot-active')
    }
    function showNextSlide(n) {
        /*для клика на стрелку вперед и назад*/
        showSlides(slideIndex += n);
    }
    function currentSlide(n) {
        /*для клика на точку*/
        showSlides(slideIndex = n)
    }
    /*обработчики нажатий на стрелки*/
    prev.addEventListener('click', function () {
        showNextSlide(-1)
    });
    next.addEventListener('click', function () {
        showNextSlide(1)
    })
    /*обработчики нажатий на кнопки*/
    dotsWrap.addEventListener('click', function (e) {
        for (let i = 0; i < dots.length + 1; i++) {
            if (e.target.classList.contains('dot') && e.target === dots[i-1]) {
                currentSlide(i)
            }
        }
    })

    /*калькулятор*/
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
});