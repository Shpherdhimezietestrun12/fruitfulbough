// This is for the viewing the privacy policy page... 
document.addEventListener('DOMContentLoaded', () => {
    const allContainers = document.querySelectorAll(
        '.cont-oe-display, .cont-two-display, .cont-three-display, .cont-four-display, .cont-five-display, .cont-six-display, .cont-seven-display, ' +
        '.cont-oe-display-2, .cont-two-display-3, .cont-three-display-4, .cont-four-display-5, .cont-five-display-6, .cont-six-display-7, .cont-seven-display-8, ' +
        '.cont-four-display-5, .cont-six-display-7' // one-off extra containers, don't follow the normal pair pattern
    );

    const navButtons = document.querySelectorAll('.nav-btn');

    // maps "one"->2, "two"->3, "three"->4, etc. to match the -2/-3/-4... suffix pattern
    function getSuffixNumber(word) {
        const order = ['one', 'two', 'three', 'four', 'five', 'six', 'seven'];
        const index = order.indexOf(word);
        return index === -1 ? '' : (index + 2); // "one" -> 2, "two" -> 3, ...
    }

    function hideAll() {
        allContainers.forEach(el => {
            el.style.display = 'none';
        });
    }

    function showTarget(word) {
        hideAll();

        const elA = document.querySelector('.cont-' + word + '-display');
        const elB = document.querySelector('.cont-' + word + '-display-' + getSuffixNumber(word));

        if (elA) elA.style.display = 'block';
        if (elB) elB.style.display = 'block';
    }

    // shows one specific class directly, bypassing the word/suffix pairing logic
    function showCustom(className) {
        hideAll();
        const el = document.querySelector('.' + className);
        if (el) el.style.display = 'block';
    }

    function setActiveButton(clickedBtn) {
        navButtons.forEach(btn => btn.classList.remove('active'));
        if (clickedBtn) clickedBtn.classList.add('active');
    }

    // handle clicks on the numbered nav buttons (1, 2, 3... Accepting terms, Privacy policy, etc.)
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetClass = btn.dataset.target; // e.g. "cont-two-display"
            if (!targetClass) return;

            const match = targetClass.match(/^cont-([a-z]+)-display$/);
            if (!match) return;

            const word = match[1];
            showTarget(word);
            setActiveButton(btn);
        });
    });

    // handle arriving from main.html via localStorage (spans clicked there)
    const storedTarget = localStorage.getItem('showContTarget'); // e.g. "two" or "custom:cont-four-display-5"

    if (storedTarget) {
        if (storedTarget.startsWith('custom:')) {
            const className = storedTarget.replace('custom:', '');
            showCustom(className);
            // no matching nav-btn for a custom one-off target, so nothing gets marked active
            setActiveButton(null);
        } else {
            showTarget(storedTarget);

            const matchingBtn = Array.from(navButtons).find(
                btn => btn.dataset.target === 'cont-' + storedTarget + '-display'
            );
            if (matchingBtn) setActiveButton(matchingBtn);
        }

        localStorage.removeItem('showContTarget');
    } else {
        hideAll();
    }
});



//
document.addEventListener('DOMContentLoaded', () => {
    // existing pair
    const containerOne = document.querySelector('.sp-ooop');
    const containerTwo = document.querySelector('.sp-ooop-12');

    // new pair
    const containerThree = document.querySelector('.sp-4043');
    const containerFour = document.querySelector('.sp-4043-12');

    // another new pair
    const containerFive = document.querySelector('.par-first-nineteen9');
    const containerSix = document.querySelector('.par-first-nineteen8-27');

    // yet another new pair
    const containerSeven = document.querySelector('.sp-4044');
    const containerEight = document.querySelector('.sp-4044-12');

    if (containerOne) {
        containerOne.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'two');
            window.location.href = './Information.html';
        });
    }

    if (containerTwo) {
        containerTwo.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'two');
            window.location.href = './Information.html';
        });
    }

    // sp-4043 -> acts like clicking the nav-btn with data-target="cont-four-display"
    if (containerThree) {
        containerThree.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'four');
            window.location.href = './Information.html';
        });
    }

    // sp-4043-12 -> shows the one-off .cont-two-display-5 (doesn't follow the normal word pattern)
    if (containerFour) {
        containerFour.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'custom:cont-four-display-5');
            window.location.href = './Information.html';
        });
    }

    // par-first-nineteen9 -> acts like clicking the nav-btn with data-target="cont-six-display"
    if (containerFive) {
        containerFive.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'six');
            window.location.href = './Information.html';
        });
    }

    // par-first-nineteen8-27 -> shows the one-off .cont-two-display-7
    if (containerSix) {
        containerSix.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'custom:cont-six-display-7');
            window.location.href = './Information.html';
        });
    }

    // sp-4044 and sp-4044-12 -> both map to "three" since cont-three-display-4
    // is the NORMAL paired suffix for "three" (not a one-off custom target)
    if (containerSeven) {
        containerSeven.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'three');
            window.location.href = './Information.html';
        });
    }

    if (containerEight) {
        containerEight.addEventListener('click', () => {
            localStorage.setItem('showContTarget', 'three');
            window.location.href = './Information.html';
        });
    }
});