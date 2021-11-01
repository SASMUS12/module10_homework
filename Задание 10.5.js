/*Задание 2.
Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана
 с помощью alert. */
const btnWidth = document.querySelector('.j-btn-test');
    btnWidth.addEventListener('click', () => {
        const screenWidth = window.screen.width
        const screenHeight = window.screen.height
        alert( `Ширина экрана: ${screenWidth} px, Высота экрана: ${screenHeight} px` );
});