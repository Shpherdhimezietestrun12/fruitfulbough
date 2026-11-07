/* Fruitful Bough - keeps the visitor on this page (disables Back and Forward as far as browsers allow).
   Use it only on pages like Connection_wrong.html. */
(function() {
    'use strict';

    function lock() {
        history.pushState({ locked: true }, '', location.href);
    }

    lock();

    // Back pressed: push the page again. This also clears the Forward stack.
    window.addEventListener('popstate', lock);

    // Page restored from the browser cache (Back/Forward cache)
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) lock();
    });

    // Chrome ignores history entries added without user interaction,
    // so add one more entry on the first click, tap or key press.
    function onFirstInteraction() {
        lock();
        ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev) {
            window.removeEventListener(ev, onFirstInteraction, true);
        });
    }
    ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev) {
        window.addEventListener(ev, onFirstInteraction, true);
    });
})();
