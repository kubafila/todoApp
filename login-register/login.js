const signInForm = document.querySelector('#sign-in-form');
const signInInputs = signInForm.querySelectorAll('input[required]');

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

        fetch(url, {
            method: method.toUpperCase(),
            body: dataToSend,
        })
        .then(ret => {
            submit.disabled = false;

            if (ret.errors) {
                ret.errors.map(function(el) {
                    return '[name="'+el+'"]'
                });

                const badFields = signInForm.querySelectorAll(ret.errors.join(','));
                checkFieldsErrors(badFields);
            } else {
                if (ret.status === 200) {
                    // wypelnic adres
		    window.location.href = "http://localhost:3000/api/tasks/";
                }
                if (ret.status === 400) {
                    //jeżeli istnieje komunikat o błędzie wysyłki
                    //np. generowany przy poprzednim wysyłaniu formularza
                    //usuwamy go, by nie duplikować tych komunikatów
                    if (document.querySelector('.send-error')) {
                        document.querySelector('.send-error').remove();
                    }
                    const div = document.createElement('div');
                    div.classList.add('send-error');
                    div.innerText = 'Logowanie się nie powiodło';
                    submit.appendChild(div);
                }
            }
        }).catch(_ => {
		console.log("error kurna");
            submit.disabled = false;
        });
    }
});
