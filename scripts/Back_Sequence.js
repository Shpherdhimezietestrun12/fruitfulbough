// like-img
const BackSequence = document.querySelector('.like-img');
if (BackSequence) {
    BackSequence.addEventListener('click', () => {
        localStorage.setItem('GoBackOne', 'true');
        window.location.href = 'index.html';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('GoBackOne') === 'true') {
        ['.greetings-display', '.presentation-2', '.div-test-one', '.cookies-div'].forEach(selector => {
            document.querySelector(selector).style.display = 'none';
        });
        localStorage.removeItem('GoBackOne');
    }
});



//