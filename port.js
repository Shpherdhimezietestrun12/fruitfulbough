//
// This is for connecing ports on different channels 
// for port connection....
// connecting the server port 
document.addEventListener('DOMContentLoaded', () => {
    const EmailIpt = document.querySelectorAll('.ipt-first-12, .ipt-first');
    const PasswordEntry = document.querySelectorAll('.ipt-first-12-156, .ipt-first-156');
    const Subbutton = document.querySelectorAll('.but-first, .but-first-12');
    const WrongEmail = document.querySelectorAll('.wrong-email-ipt-2, .wrong-email');
    const ServerResponse = document.querySelector('.loading-div-sh');

    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Subbutton is a NodeList (from querySelectorAll), so it needs .forEach()
    // to attach a listener to EACH button — addEventListener() alone only
    // works on a single element, not a list of them.
    Subbutton.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            // "index" pairs this button with the matching email input and
            // wrong-email message at the same position in their own lists.
            // e.g. Subbutton[0] -> EmailIpt[0] -> WrongEmail[0]
            const emailInput = EmailIpt[index];
            const wrongEmailMsg = WrongEmail[index];
            const passwordInput = PasswordEntry[index];

            if (!emailInput) return; // safety check in case lists don't line up

            const EmailValue = emailInput.value.trim();
            const isValid = EmailRegex.test(EmailValue);

            if (!isValid) {
                // show the "wrong email" message for this specific section
                if (wrongEmailMsg) {
                    wrongEmailMsg.textContent = 'Please enter a valid email';
                    wrongEmailMsg.style.display = 'block';
                }
                return; // stop here, don't proceed to submit
            }

            // email is valid — now check the password field isn't empty
            const PasswordValue = passwordInput ? passwordInput.value.trim() : '';

            if (!PasswordValue) {
                if (wrongEmailMsg) {
                    wrongEmailMsg.textContent = 'Pls input your password';
                    wrongEmailMsg.style.display = 'block';
                }
                return; // stop here, don't proceed to submit
            }

            // both email and password are valid: hide any previous error message
            if (wrongEmailMsg) {
                wrongEmailMsg.style.display = 'none';
            }

            // show a loading indicator while "submitting"
            if (ServerResponse) {
                ServerResponse.style.display = 'block';
            }

            const ChnServerMessage = document.querySelector('.print-server');

            // intentionally delay the actual login request by 6 seconds
            setTimeout(() => {
                if (ChnServerMessage) {
                    ChnServerMessage.textContent = 'Connection started';
                    fetch('http://15.237.219.118:5000/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: EmailValue,
                                password: PasswordValue
                            })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (ServerResponse) ServerResponse.style.display = 'none';

                            if (data.exists) {
                                // email + password matched a record in the database
                                console.log('Login successful:', data);
                                // ---- put your "logged in successfully" logic here ----
                                // window.location.replace() (instead of .href) does NOT
                                // add this page to browser history — so clicking "Back"
                                // afterward skips over the login page entirely instead
                                // of returning to it.
                                window.location.replace('./Setting.html');

                                // A plain JS variable/array/object would be wiped the
                                // instant the browser navigates to a new page, since
                                // the whole JS environment resets on page load. To make
                                // the logged-in user's email available on Setting.html
                                // (and any other page), save it to localStorage instead
                                // — this persists across page loads/navigation.
                                localStorage.setItem('loggedInEmail', EmailValue);
                            } else {
                                // email/password combo does NOT exist in the database
                                console.log('Login failed:', data);
                                localStorage.setItem('showContTarget', 'six');
                                window.location.href = './Information.html';
                            }
                        })
                        .catch(err => {
                            if (ServerResponse) ServerResponse.style.display = 'none';
                            console.error('Error:', err);

                            // fetch() throws a generic "Failed to fetch" TypeError for
                            // network-level failures — this covers cases like
                            // net::ERR_CONNECTION_REFUSED, no internet connection,
                            // server not running, CORS blocks, DNS failures, etc.
                            if (wrongEmailMsg) {
                                wrongEmailMsg.textContent = 'Reload page to spool server';
                                wrongEmailMsg.style.display = 'block';
                            }
                        });
                }
            }, 15000);
        });
    });
});