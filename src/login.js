const signInForm = document.querySelector('#sign-in-form');
const signInInputs = signInForm.querySelectorAll('input[required]');
const emailSignIn = document.getElementById("field-email-sign-in");
const passwordSignIn = document.getElementById("field-password-sign-in");
let loginError = false;
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
        .then(res =>{
            //wsytko dobrze
            if (res.status == 200){
                   window.location.href = "http://localhost:3000/app"
                
            }
            else{
                loginError = true;
                
            }
            return res.text()
            
        } )
        .then(res => {
            if(loginError == true){
            swal({
                title: "Oj. Coś poszło nie tak",
                text: `Błąd: ${res}`,
                icon: "error",
                button: "Ok",
                });
                loginError = false;
            }
            else{
            localStorage.setItem("userKey", res);
            console.log(res)
            //TUTAJ PODAĆ ADRES STRONY GŁÓWNEJ
            //window.location.href = "http://127.0.0.1:5500/index.html";
            }

        })
    }
});


/*



*/