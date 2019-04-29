const signUpForm = document.querySelector('#sign-up-form');
const signUpInputs = signUpForm.querySelectorAll('input[required]');
const nameSignUp = document.getElementById("field-name-sign-up");
const emailSignUp = document.getElementById("field-email-sign-up");
const passwordSignUp = document.getElementById("field-password-sign-up");
//wyłączamy domyślną walidację
signUpForm.setAttribute('novalidate', true);

//zamieniamy inputs na tablicę i robimy po niej pętlę
[...signUpInputs].forEach(elem => {
    elem.addEventListener('input', function() {
        if (!this.checkValidity()) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
            hideFieldError(this);
        }
    });
});

signUpForm.addEventListener('submit', e => {
    e.preventDefault();

    //jeżeli wszystkie pola są poprawne...
    if (checkFieldsErrors(signUpInputs)) {
        //generujemy dane jako obiekt dataToSend
        //domyślnie elementy disabled nie są wysyłane!
        const elements = signUpForm.querySelectorAll('input:not(:disabled)');

        const dataToSend = new FormData();
        [...elements].forEach(el => dataToSend.append(el.name, el.value));

        const submit = document.querySelector('#sign-up-form');
        submit.disabled = true;

        const url = signUpForm.getAttribute('action');
        const method = signUpForm.getAttribute('method');
        


        fetch(url, {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameSignUp.value,
                email: emailSignUp.value,
                password: passwordSignUp.value
            })
        })
        .then(ret => {
            submit.disabled = false;

            if (ret.errors) {
                ret.errors.map(function (el) {
                    return '[name="' + el + '"]'
                });

                const badFields = signUpForm.querySelectorAll(ret.errors.join(','));
                checkFieldsErrors(badFields);
            } else {
                if (ret.status === 200) {
                    	swal({
                    	    title: "Konto utworzone!",
                    	    text: "Teraz możesz się zalogować",
                    	    icon: "success",
                    	    button: "Ok",
                    	});
                    document.querySelector('.sign-up-container').parentElement.classList.remove("right-panel-active");
                }
                else {
                    	swal({
                    	    title: "Oj",
                    	    text: "Coś poszło nie tak. Spróbuj ponownie z innymi danymi",
                    	    icon: "error",
                    	    button: "Ok",
                    	});
                }
            }
        })
        .catch(_ => {
            submit.disabled = false;
        });
        
    }
});


/*






*/