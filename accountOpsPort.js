// for the pc 
document.addEventListener('DOMContentLoaded', () => {
    // handle 
    // lets take the first part of this code well 
    // ...
    const FirstNameEntryPointOne = document.querySelector('.ipt-pro-one');
    const LastNameEntryPointOne = document.querySelector('.ipt-pro-two');
    const EmailEntryPointOne = document.querySelector('.ipt-email');
    const PasswordEntryPointOne = document.querySelector('.ipt-pass');
    const WrongMessage = document.querySelector('.par-wrong-input');
    const AgreeTermsAndConOne = document.querySelector('.ipt-check'); // this is for checkbox
    const SubmitButtonForAllOne = document.querySelector('.bnt-100');
    const ServerResponseTest = document.querySelector('.loading-div-sh');


    function checkAllFilled() {
        const firstNameFilled = FirstNameEntryPointOne && FirstNameEntryPointOne.value.trim();
        const lastNameFilled = LastNameEntryPointOne && LastNameEntryPointOne.value.trim();
        const emailFilled = EmailEntryPointOne && EmailEntryPointOne.value.trim();
        const passwordFilled = PasswordEntryPointOne && PasswordEntryPointOne.value.trim();
        const termsAgreed = AgreeTermsAndConOne && AgreeTermsAndConOne.checked;

        if (SubmitButtonForAllOne) {
            if (firstNameFilled && lastNameFilled && emailFilled && passwordFilled && termsAgreed) {
                SubmitButtonForAllOne.style.backgroundColor = 'rgb(172, 126, 2)';
                SubmitButtonForAllOne.style.color = 'white';
            } else {
                // reset back to default styling while anything is still missing
                SubmitButtonForAllOne.style.backgroundColor = '';
                SubmitButtonForAllOne.style.color = '';
            }
        }
    }

    // run the check live, on every keystroke/change — no click needed
    if (FirstNameEntryPointOne) FirstNameEntryPointOne.addEventListener('input', checkAllFilled);
    if (LastNameEntryPointOne) LastNameEntryPointOne.addEventListener('input', checkAllFilled);
    if (EmailEntryPointOne) EmailEntryPointOne.addEventListener('input', checkAllFilled);
    if (PasswordEntryPointOne) PasswordEntryPointOne.addEventListener('input', checkAllFilled);
    if (AgreeTermsAndConOne) AgreeTermsAndConOne.addEventListener('change', checkAllFilled);

    // this is for matching each input 
    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (SubmitButtonForAllOne) {
        SubmitButtonForAllOne.addEventListener('click', () => {
            const firstNameVal = FirstNameEntryPointOne ? FirstNameEntryPointOne.value.trim() : '';
            const lastNameVal = LastNameEntryPointOne ? LastNameEntryPointOne.value.trim() : '';
            const emailVal = EmailEntryPointOne ? EmailEntryPointOne.value.trim() : '';
            const passwordVal = PasswordEntryPointOne ? PasswordEntryPointOne.value.trim() : '';
            const termsChecked = AgreeTermsAndConOne ? AgreeTermsAndConOne.checked : false;

            // 1. first name filled?
            if (!firstNameVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'firstName is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 2. last name filled?
            if (!lastNameVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'LastName is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 3. email filled?
            if (!emailVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Email is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 4. password filled?
            if (!passwordVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Password is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 4b. password strong enough? requires:
            // - at least 8 characters
            // - at least one uppercase letter
            // - at least one number
            // - at least one special character (covers +, -, @, #, $, %, etc.)
            const PasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

            if (!PasswordRegex.test(passwordVal)) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Password not strong, eg: Mypassword@123+';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 5. terms and conditions checked?
            if (!termsChecked) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Terms and Conditions needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 6. email format valid?
            if (!EmailRegex.test(emailVal)) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Pls input valid email';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // everything passed: hide the error message
            if (WrongMessage) {
                WrongMessage.style.display = 'none';
            }

            // save the validated data so another script can read it later
            // (e.g. right before calling the server). A plain JS
            // variable/array/object here would only exist in THIS script's
            // own memory — localStorage is what lets a SEPARATE script
            // (even on a different page load) access it afterward.
            const SignupData = {
                validated: true,
                firstName: firstNameVal,
                lastName: lastNameVal,
                name: firstNameVal + '+' + lastNameVal, // joined with "+", e.g. "Chimezie+Nosike"
                email: emailVal,
                password: passwordVal
            };

            localStorage.setItem('signupFormData', JSON.stringify(SignupData));

            // all checks passed and data is saved — now show the loading indicator
            const ServerResponseTest = document.querySelector('.loading-div-sh');
            if (ServerResponseTest) {
                ServerResponseTest.style.display = 'block';
            }

            // wait 15 seconds, then check if this email already exists
            setTimeout(() => {
                fetch('https://api.fruitfulbough.xyz/validate-credentials', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(SignupData)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.exists) {
                            // email already taken — stop here, don't create account
                            if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                            if (WrongMessage) {
                                WrongMessage.textContent = 'email already exists';
                                WrongMessage.style.display = 'block';
                            }
                            return;
                        }

                        // email is available — proceed to actually create the account
                        fetch('https://api.fruitfulbough.xyz/create-account', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(SignupData)
                            })
                            .then(res => {
                                // fetch() does NOT reject on HTTP error codes like
                                // 400/500 — only on network failures. So we have to
                                // manually check res.ok (true only for 200-299) here,
                                // otherwise a server error gets treated as success.
                                return res.json().then(body => ({ ok: res.ok, body }));
                            })
                            .then(({ ok, body: createData }) => {
                                if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                                console.log('Server response:', createData);

                                if (!ok || !createData.success) {
                                    // the request reached the server but it reported
                                    // failure (e.g. database error) — do NOT show
                                    // success or redirect
                                    if (WrongMessage) {
                                        WrongMessage.textContent = createData.error || 'Account creation failed, pls try again';
                                        WrongMessage.style.display = 'block';
                                    }
                                    return;
                                }

                                // genuinely successful — NOW it's safe to show success
                                const AccountSuccess = document.querySelector('.par-valid-self');
                                if (AccountSuccess) {
                                    AccountSuccess.textContent = 'Account created successfully!';
                                    AccountSuccess.style.display = 'block';
                                }

                                // clear the signup data now that it's been saved to
                                // the server — no need to keep the password sitting
                                // around in localStorage any longer
                                localStorage.removeItem('signupFormData');

                                // wait 7 seconds (so the user can actually read the
                                // success message) then redirect. .replace() instead
                                // of .href means the signup page won't sit in the
                                // browser's back-history afterward.
                                setTimeout(() => {
                                    window.location.replace('./main.html');
                                }, 7000);
                            })
                            .catch(err => {
                                if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                                console.error('Error creating account:', err);
                                if (WrongMessage) {
                                    WrongMessage.textContent = 'Connection Lost pls reload';
                                    WrongMessage.style.display = 'block';
                                }
                            });
                    })
                    .catch(err => {
                        if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                        console.error('Error:', err);

                        // fetch() throws this generic error for network-level
                        // failures — no internet, server not running,
                        // net::ERR_CONNECTION_REFUSED, DNS failure, etc.
                        if (WrongMessage) {
                            WrongMessage.textContent = 'Connection Lost pls reload';
                            WrongMessage.style.display = 'block';
                        }
                    });
            }, 15000);
        });
    }

});

// For the Phone

document.addEventListener('DOMContentLoaded', () => {

    const FirstNameEntryPointTwo = document.querySelector('.ipt-pro-one-12');
    const LastNameEntryPointTwo = document.querySelector('.ipt-pro-two-12');
    const EmailEntryPointTwo = document.querySelector('.ipt-email-12');
    const PasswordEntryPointTwo = document.querySelector('.ipt-pass-12');
    const WrongMessage = document.querySelector('.par-wrong-input-12');
    const AgreeTermsAndConTwo = document.querySelector('.ipt-check-12'); // this is for checkbox
    const SubmitButtonForAllTwo = document.querySelector('.bnt-100-12');

    function checkAllFilled() {
        const firstNameFilled = FirstNameEntryPointTwo && FirstNameEntryPointTwo.value.trim();
        const lastNameFilled = LastNameEntryPointTwo && LastNameEntryPointTwo.value.trim();
        const emailFilled = EmailEntryPointTwo && EmailEntryPointTwo.value.trim();
        const passwordFilled = PasswordEntryPointTwo && PasswordEntryPointTwo.value.trim();
        const termsAgreed = AgreeTermsAndConTwo && AgreeTermsAndConTwo.checked;

        if (SubmitButtonForAllTwo) {
            if (firstNameFilled && lastNameFilled && emailFilled && passwordFilled && termsAgreed) {
                SubmitButtonForAllTwo.style.backgroundColor = 'rgb(172, 126, 2)';
                SubmitButtonForAllTwo.style.color = 'white';
            } else {
                // reset back to default styling while anything is still missing
                SubmitButtonForAllTwo.style.backgroundColor = '';
                SubmitButtonForAllTwo.style.color = '';
            }
        }
    }

    // run the check live, on every keystroke/change — no click needed
    if (FirstNameEntryPointTwo) FirstNameEntryPointTwo.addEventListener('input', checkAllFilled);
    if (LastNameEntryPointTwo) LastNameEntryPointTwo.addEventListener('input', checkAllFilled);
    if (EmailEntryPointTwo) EmailEntryPointTwo.addEventListener('input', checkAllFilled);
    if (PasswordEntryPointTwo) PasswordEntryPointTwo.addEventListener('input', checkAllFilled);
    if (AgreeTermsAndConTwo) AgreeTermsAndConTwo.addEventListener('change', checkAllFilled);

    // this is for the phone setup 
    const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (SubmitButtonForAllTwo) {
        SubmitButtonForAllTwo.addEventListener('click', () => {
            const firstNameVal = FirstNameEntryPointTwo ? FirstNameEntryPointTwo.value.trim() : '';
            const lastNameVal = LastNameEntryPointTwo ? LastNameEntryPointTwo.value.trim() : '';
            const emailVal = EmailEntryPointTwo ? EmailEntryPointTwo.value.trim() : '';
            const passwordVal = PasswordEntryPointTwo ? PasswordEntryPointTwo.value.trim() : '';
            const termsChecked = AgreeTermsAndConTwo ? AgreeTermsAndConTwo.checked : false;

            // 1. first name filled?
            if (!firstNameVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'firstName is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 2. last name filled?
            if (!lastNameVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'LastName is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 3. email filled?
            if (!emailVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Email is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 4. password filled?
            if (!passwordVal) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Password is needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }


            // 4b. password strong enough? requires:
            // - at least 8 characters
            // - at least one uppercase letter
            // - at least one number
            // - at least one special character (covers +, -, @, #, $, %, etc.)
            const PasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

            if (!PasswordRegex.test(passwordVal)) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Password not strong, eg: Mypassword@123+';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 5. terms and conditions checked?
            if (!termsChecked) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Terms and Conditions needed';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // 6. email format valid?
            if (!EmailRegex.test(emailVal)) {
                if (WrongMessage) {
                    WrongMessage.textContent = 'Pls input valid email';
                    WrongMessage.style.display = 'block';
                }
                return;
            }

            // everything passed: hide the error message
            if (WrongMessage) {
                WrongMessage.style.display = 'none';
            }

            // save the validated data so another script can read it later
            // (e.g. right before calling the server). A plain JS
            // variable/array/object here would only exist in THIS script's
            // own memory — localStorage is what lets a SEPARATE script
            // (even on a different page load) access it afterward.
            const SignupData = {
                validated: true,
                firstName: firstNameVal,
                lastName: lastNameVal,
                name: firstNameVal + '+' + lastNameVal, // joined with "+", e.g. "Chimezie+Nosike"
                email: emailVal,
                password: passwordVal
            };

            localStorage.setItem('signupFormData', JSON.stringify(SignupData));

            // all checks passed and data is saved — now show the loading indicator
            const ServerResponseTest = document.querySelector('.loading-div-sh');
            if (ServerResponseTest) {
                ServerResponseTest.style.display = 'block';
            }

            // wait 15 seconds, then check if this email already exists
            setTimeout(() => {
                fetch('https://api.fruitfulbough.xyz/validate-credentials', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(SignupData)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.exists) {
                            // email already taken — stop here, don't create account
                            if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                            if (WrongMessage) {
                                WrongMessage.textContent = 'email already exists';
                                WrongMessage.style.display = 'block';
                            }
                            return;
                        }

                        // email is available — proceed to actually create the account
                        fetch('https://api.fruitfulbough.xyz/create-account', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(SignupData)
                            })
                            .then(res => {
                                // fetch() does NOT reject on HTTP error codes like
                                // 400/500 — only on network failures. So we have to
                                // manually check res.ok (true only for 200-299) here,
                                // otherwise a server error gets treated as success.
                                return res.json().then(body => ({ ok: res.ok, body }));
                            })
                            .then(({ ok, body: createData }) => {
                                if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                                console.log('Server response:', createData);

                                if (!ok || !createData.success) {
                                    // the request reached the server but it reported
                                    // failure (e.g. database error) — do NOT show
                                    // success or redirect
                                    if (WrongMessage) {
                                        WrongMessage.textContent = createData.error || 'Account creation failed, pls try again';
                                        WrongMessage.style.display = 'block';
                                    }
                                    return;
                                }

                                // genuinely successful — NOW it's safe to show success
                                const AccountSuccess = document.querySelector('.par-valid-self');
                                if (AccountSuccess) {
                                    AccountSuccess.textContent = 'Account created successfully!';
                                    AccountSuccess.style.display = 'block';
                                }

                                // clear the signup data now that it's been saved to
                                // the server — no need to keep the password sitting
                                // around in localStorage any longer
                                localStorage.removeItem('signupFormData');

                                // wait 7 seconds (so the user can actually read the
                                // success message) then redirect. .replace() instead
                                // of .href means the signup page won't sit in the
                                // browser's back-history afterward.
                                setTimeout(() => {
                                    window.location.replace('./main.html');
                                }, 7000);
                            })
                            .catch(err => {
                                if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                                console.error('Error creating account:', err);
                                if (WrongMessage) {
                                    WrongMessage.textContent = 'Connection Lost pls reload';
                                    WrongMessage.style.display = 'block';
                                }
                            });
                    })
                    .catch(err => {
                        if (ServerResponseTest) ServerResponseTest.style.display = 'none';
                        console.error('Error:', err);

                        // fetch() throws this generic error for network-level
                        // failures — no internet, server not running,
                        // net::ERR_CONNECTION_REFUSED, DNS failure, etc.
                        if (WrongMessage) {
                            WrongMessage.textContent = 'Connection Lost pls reload';
                            WrongMessage.style.display = 'block';
                        }
                    });
            }, 15000);

        });
    }

});
