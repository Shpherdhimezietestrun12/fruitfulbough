/* Fruitful Bough - sign-up handling (validation, loading overlay, submit, redirect) */
(function() {
    'use strict';

    // ---- Settings you may want to change later ---------------------------------
    var CONFIG = {
        apiUrl: 'http://127.0.0.1:5000/api/signup', // where mock/app.py is running
        verifyPage: 'verify.html', // page to open after success
        redirectDelayMs: 2000, // wait after loading overlay closes
        minCheckMs: 5000, // the loading overlay stays at least this long while the server checks the account
        accountExistsPage: '../errors/errors/account_exists.html', // shown when the name or email is taken
        maxConnectionFailures: 3, // connection failures allowed before redirecting
        connectionErrorPage: '../errors/errors/Connection_wrong.html' // page shown after too many failures
    };

    // Counts failed connections in a row. Kept in sessionStorage so a page refresh does not reset it.
    var FAIL_KEY = 'fb_conn_failures';
    var connectionFailures = readFailures();

    function readFailures() {
        try { return parseInt(sessionStorage.getItem(FAIL_KEY), 10) || 0; } catch (e) { return 0; }
    }

    function saveFailures(n) {
        connectionFailures = n;
        try { sessionStorage.setItem(FAIL_KEY, String(n)); } catch (e) { /* ignore */ }
    }

    // ---- Validation rules --------------------------------------------------------
    // Display name: letters, then numbers, then special character(s)  e.g. Shepherd123@
    var NAME_RE = /^[A-Za-z]{2,}[0-9]+[^A-Za-z0-9\s]+$/;

    var form = document.getElementById('signup-form');
    if (!form) return;

    var nameInput = document.getElementById('display-name');
    var emailInput = document.getElementById('email');
    var passInput = document.getElementById('password');
    var confirmInput = document.getElementById('confirm-password');
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

    function showStatus(message, isError) {
        statusBox.textContent = message;
        statusBox.classList.toggle('error', !!isError);
        statusBox.hidden = false;
    }

    function checkName() {
        var v = nameInput.value.trim();
        if (!NAME_RE.test(v)) {
            return 'Use letters, then numbers, then a special character, like Shepherd123@';
        }
        return '';
    }

    function checkEmail() {
        var v = emailInput.value.trim();
        if (!v || !emailInput.validity.valid) return 'Enter a valid email address.';
        return '';
    }

    function checkPassword() {
        var v = passInput.value;
        var missing = [];
        if (v.length < 8) missing.push('at least 8 characters');
        if (!/[A-Za-z]/.test(v)) missing.push('a letter');
        if (!/[0-9]/.test(v)) missing.push('a number');
        if (!/[^A-Za-z0-9\s]/.test(v)) missing.push('a special character');
        if (/\s/.test(v)) return 'Password cannot contain spaces.';
        return missing.length ? 'Password needs ' + missing.join(', ') + '.' : '';
    }

    function checkConfirm() {
        if (!confirmInput.value || confirmInput.value !== passInput.value) return 'Passwords must match.';
        return '';
    }

    var checks = [
        [nameInput, checkName],
        [emailInput, checkEmail],
        [passInput, checkPassword],
        [confirmInput, checkConfirm]
    ];

    // Clear / re-check a field as the user types after an error was shown
    checks.forEach(function(pair) {
        pair[0].addEventListener('input', function() {
            if (pair[0].closest('.field').classList.contains('invalid')) setError(pair[0], pair[1]());
            if (pair[0] === passInput && confirmInput.closest('.field').classList.contains('invalid')) {
                setError(confirmInput, checkConfirm());
            }
        });
    });

    function setLoading(on) {
        if (loading) loading.style.display = on ? 'block' : 'none';
        submitBtn.disabled = on;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
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

        var payload = {
            displayName: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passInput.value
        };

        setLoading(true);
        var startedAt = Date.now();

        fetch(CONFIG.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(function(res) {
                // The server answered, so the connection works
                saveFailures(0);
                return res.json().catch(function() { return {}; }).then(function(body) {
                    // Keep the loading overlay up for at least minCheckMs, whatever the outcome
                    var wait = Math.max(0, CONFIG.minCheckMs - (Date.now() - startedAt));
                    setTimeout(function() {
                        setLoading(false);
                        if (res.status === 409 && body && body.code === 'account_exists') {
                            window.location.href = CONFIG.accountExistsPage;
                            return;
                        }
                        if (!res.ok) {
                            showStatus((body && body.error) || 'Could not create your account. Please try again.', true);
                            return;
                        }
                        try { sessionStorage.setItem('fb_signup_email', payload.email); } catch (e) { /* ignore */ }
                        showStatus('Account created. Taking you to verification...', false);
                        setTimeout(function() { window.location.href = CONFIG.verifyPage; }, CONFIG.redirectDelayMs);
                    }, wait);
                });
            }, function() {
                // Only real connection failures (server off / unreachable) land here
                setLoading(false);
                saveFailures(connectionFailures + 1);
                if (connectionFailures >= CONFIG.maxConnectionFailures) {
                    saveFailures(0); // start fresh next time
                    // replace() removes the sign-up page from history, so Back cannot return to it
                    window.location.replace(CONFIG.connectionErrorPage);
                    return;
                }
                showStatus('Connection problem with the server. Try again later.', true);
            });
    });
})();