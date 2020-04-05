/*СЛАЙДЕР*/
function slider() {
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
}
module.exports = slider