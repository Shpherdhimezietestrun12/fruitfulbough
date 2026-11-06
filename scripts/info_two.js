// Selecting each ui's
// For privacy policy UI
// This is for the viewing the privacy policy page... 
const containers = document.querySelectorAll('.sp-ooop, .sp-4043');

containers.forEach(container => {
    container.addEventListener('click', () => {
        localStorage.setItem('showContOne', 'true');
        window.location.href = 'Information.html';
    });
});
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('showContOne') === 'true') {
        const navBtn = document.querySelector('.cont-one-1234');
        if (navBtn) {
            navBtn.click();
        }
        localStorage.removeItem('showContOne');
    }
});



// For Terms and conditions UI
// This is for the viewing the Terms of Conditions page...
const TermsContainer = document.querySelector('.sp-4032');
if (TermsContainer) {
    TermsContainer.addEventListener('click', () => {
        localStorage.setItem('showContTwo', 'true');
        window.location.href = 'Information.html';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('showContTwo') === 'true') {
        const navBtn = document.querySelector('.cont-one-123');
        if (navBtn) {
            navBtn.click();
        }
        localStorage.removeItem('showContTwo');
    }
});


// This is for the viewing the FB Informations page...
const FBInfoContainer = document.querySelector('.sp-4044');
if (FBInfoContainer) {
    FBInfoContainer.addEventListener('click', () => {
        localStorage.setItem('showContThree', 'true');
        window.location.href = 'Information.html';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('showContThree') === 'true') {
        const navBtn = document.querySelector('.cont-one-12345');
        if (navBtn) {
            navBtn.click();
        }
        localStorage.removeItem('showContThree');
    }
});



// This is for the viewing the Cookie Details page... 
const CookieContainer = document.querySelector('.par-first-nineteen9');
if (CookieContainer) {
    CookieContainer.addEventListener('click', () => {
        localStorage.setItem('showContFour', 'true');
        window.location.href = 'Information.html';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('showContFour') === 'true') {
        const navBtn = document.querySelector('.cont-one-123456');
        if (navBtn) {
            navBtn.click();
        }
        localStorage.removeItem('showContFour');
    }
});



// This is for the viewing the Cookie Details page... 
const CookieContainerTwo = document.querySelector('.par-eeee-4');
if (CookieContainerTwo) {
    CookieContainerTwo.addEventListener('click', () => {
        localStorage.setItem('showContFive', 'true');
        window.location.href = '../Information.html';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('showContFive') === 'true') {
        const navBtn = document.querySelector('.cont-one-123456');
        if (navBtn) {
            navBtn.click();
        }
        localStorage.removeItem('showContFive');
    }
});