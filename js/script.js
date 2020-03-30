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

    closeOverlay.addEventListener('click', function() {
        overlay.style.display = 'none'; /*скрываем модальное окно со страницы*/
        openOverlay.classList.remove('more-splash');
        document.body.style.overflow = '' /*возвращаем прокрутку страницы*/
    });

    /*ФОРМА Модального окна*/
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся!',
        failure: 'Что-то пошло не так'
    };
    /*получаем форму и ее инпуты*/
    let form = document.querySelector('.main-form');
    let inputs = document.getElementsByTagName('input');
    /*создаем новый блок, в который будем помещать сообщение, который будет вылезать после отправки формы*/
    let statusMessage = document.createElement('div');
    statusMessage.classList.add('status');
    /*вешаем обработчик отправки формы (submit) не на кнопку, а на всю форму!*/
    form.addEventListener('submit', function(event) {
        event.preventDefault(); /*отменяем стандартное поведение формы перезагружать страницу при сабмите*/
        form.appendChild(statusMessage); /*когда происходит сабмит, вставляем statusMessage в конец родительского блока*/

        /*создаем и настраиваем запрос*/
        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        /*с помощью FormData получаем данные, которые пользователь ввел в форме в виде ключ-значение*/
        let formData = new FormData(form);
        /*чтоб перевести эти данные в JSON, создадим пустой {} и с помощью forEach закинем в него все данные {}*/
        let obj = {};
        formData.forEach((value, key) => {
            obj[key] = value
        });
        /*превратим {} в JSON при помощи stringify и отправим его на сервер*/
        let json = JSON.stringify(obj);
        request.send(json);
        /*обрабатываем состояние запроса и относительно него показываем различый message*/
        request.addEventListener('readystatechange', function () {
            if (request.readyState < 4) {
                statusMessage.textContent = message.loading
            } else if (request.readyState === 4 && request.status === 200) {
                statusMessage.textContent = message.success
            } else {
                statusMessage.textContent = message.failure
            }
        });
        /*после сабмита зачищаем инпуты*/
        for (let i=0; i < inputs.length; i++) {
            inputs[i].value = ''
        }
    })

    /*ФОРМА Контактной формы*/
    let contactMessage = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с Вами свяжемся!',
        failure: 'Что-то пошло не так'
    };
    let contactForm = document.querySelector('#form');
    let contactInputs = contactForm.querySelectorAll('input');
    let contactStatusMessage = document.createElement('div');
    contactStatusMessage.classList.add('status');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        contactForm.appendChild(contactStatusMessage);

        let request = new XMLHttpRequest();
        request.open('POST', 'server.php');
        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let formData = new FormData(contactForm);
        let obj = {};
        formData.forEach((value, key) => {
            obj[key] = value
        });
        let json = JSON.stringify(obj);
        request.send(json);
        request.addEventListener('readystatechange', () => {
            if (request.readyState < 4) {
                contactStatusMessage.textContent = contactMessage.loading
            } else if (request.readyState === 4 && request.status === 200) {
                contactStatusMessage.textContent = contactMessage.success
            } else {
                contactStatusMessage.textContent = contactMessage.failure
            }
        });
        for (let i=0; i < contactInputs.length; i++) {
            contactInputs[i].value = ''
        }
    })
});