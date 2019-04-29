const signInForm = document.querySelector('#sign-in-form');
const signInInputs = signInForm.querySelectorAll('input[required]');
const emailSignIn = document.getElementById("field-email-sign-in");
const passwordSignIn = document.getElementById("field-password-sign-in");

//wyłączamy domyślną walidację
signInForm.setAttribute('novalidate', true);

//zamieniamy inputs na tablicę i robimy po niej pętlę
[...signInInputs].forEach(elem => {
    elem.addEventListener('input', function() {
        if (!this.checkValidity()) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
            hideFieldError(this);
        }
    });
});

signInForm.addEventListener('submit', e => {
    e.preventDefault();

    //jeżeli wszystkie pola są poprawne...
    if (checkFieldsErrors(signInInputs)) {
        //generujemy dane jako obiekt dataToSend
        //domyślnie elementy disabled nie są wysyłane!
        const elements = signInForm.querySelectorAll('input:not(:disabled)');

        const dataToSend = new FormData();
        [...elements].forEach(el => dataToSend.append(el.name, el.value));

        const submit = document.querySelector('#sign-in-form');
        submit.disabled = true;

        const url = signInForm.getAttribute('action');
        const method = signInForm.getAttribute('method');

        

        fetch("http://localhost:3000/api/auth", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailSignIn.value,
                password: passwordSignIn.value
            })
        })
        //jwc token
        .then(res => res.text())
        .then(res => {
            localStorage.setItem("userKey", res);
            window.location.href = "http://127.0.0.1:5500/index.html";
        })
    }
});


/*



*/