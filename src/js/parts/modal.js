/*Модальное окно*/
function modal() {
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
}
module.exports = modal