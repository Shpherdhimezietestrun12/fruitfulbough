/* Fruitful Bough - log-in handling (validation, loading overlay, check, redirect) */
(function() {
    'use strict';

    // ---- Settings you may want to change later ---------------------------------
    var CONFIG = {
        apiUrl: 'http://127.0.0.1:5000/api/login', // where mock/app.py is running
        onboardingPage: '../onboarding/onboarding.html', // opens when email and password match
        notFoundPage: '../errors/errors/404_Not_found.html', // opens when the credentials are wrong
        connectionErrorPage: '../errors/errors/Connection_wrong.html', // opens on timeout or no connection
        minCheckMs: 5000, // the loading overlay stays at least this long
        timeoutMs: 15000 // give up and show the connection error after this long
    };

    var form = document.getElementById('login-form');
    if (!form) return;

    var emailInput = document.getElementById('email');
    var passInput = document.getElementById('password');
    var submitBtn = form.querySelector('.submit');
    var statusBox = form.querySelector('.status');
    var loading = document.querySelector('.loading-div-sh');

    function setError(input, message) {
        var field = input.closest('.field');
        var out = field.querySelector('.field-error');
        if (message) {
            field.classList.add('invalid');
            out.textContent = message;
        } else {
            field.classList.remove('invalid');
            out.textContent = '';
        }
    }

    function showStatus(message) {
        statusBox.textContent = message;
        statusBox.classList.add('error');
        statusBox.hidden = false;
    }

    function setLoading(on) {
        if (loading) loading.style.display = on ? 'block' : 'none';
        submitBtn.disabled = on;
    }

    // Login only checks that something sensible was typed; the server decides if it is correct
    function checkEmail() {
        var v = emailInput.value.trim();
        if (!v || !emailInput.validity.valid) return 'Enter a valid email address.';
        return '';
    }

    function checkPassword() {
        return passInput.value ? '' : 'Enter your password.';
    }

    var checks = [
        [emailInput, checkEmail],
        [passInput, checkPassword]
    ];

    checks.forEach(function(pair) {
        pair[0].addEventListener('input', function() {
            if (pair[0].closest('.field').classList.contains('invalid')) setError(pair[0], pair[1]());
        });
    });

    var busy = false;

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        if (busy) return;
        statusBox.hidden = true;

        var firstBad = null;
        checks.forEach(function(pair) {
            var msg = pair[1]();
            setError(pair[0], msg);
            if (msg && !firstBad) firstBad = pair[0];
        });
        if (firstBad) {
            firstBad.focus();
            return;
        }

        busy = true;
        setLoading(true);
        var startedAt = Date.now();
        var controller = new AbortController();
        var timer = setTimeout(function() { controller.abort(); }, CONFIG.timeoutMs);

        fetch(CONFIG.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value.trim(), password: passInput.value }),
                signal: controller.signal
            })
            .then(function(res) {
                return res.json().catch(function() { return {}; }).then(function(body) {
                    clearTimeout(timer);
                    // Keep the loading overlay up for at least minCheckMs, whatever the outcome
                    var wait = Math.max(0, CONFIG.minCheckMs - (Date.now() - startedAt));
                    setTimeout(function() {
                        if (res.ok && body && body.ok) {
                            try {
                                sessionStorage.setItem('fb_user', JSON.stringify({ id: body.id, displayName: body.displayName }));
                            } catch (e) { /* ignore */ }
                            window.location.href = CONFIG.onboardingPage;
                            return;
                        }
                        if (res.status === 401) {
                            window.location.href = CONFIG.notFoundPage;
                            return;
                        }
                        busy = false;
                        setLoading(false);
                        showStatus((body && body.error) || 'Could not log you in. Please try again.');
                    }, wait);
                });
            }, function() {
                // Server unreachable, or no answer within timeoutMs
                clearTimeout(timer);
                window.location.replace(CONFIG.connectionErrorPage);
            });
    });
})();
