/*ФОРМА Модального окна и Контактов с помощью промисов*/
function form() {
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
}
module.exports = form