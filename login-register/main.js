const signUpButton = document.getElementById('signUp');
const singInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => 
    container.classList.add('right-panel-active')
);

singInButton.addEventListener('click', () => 
    container.classList.remove('right-panel-active')
);

const displayFieldError = function(elem) {
    const inputContainer = elem.closest('.input-container');
    const fieldError = inputContainer.querySelector('.field-error');
    //jeżeli komunikat z błędem pod polem nie istnieje...
    if (fieldError === null) {
        //pobieramy z pola tekst błędu
        //i tworzymy pole
        const errorText = elem.dataset.error;
        const divError = document.createElement('div');
        divError.classList.add('field-error');
        divError.innerText = errorText;
        inputContainer.appendChild(divError);
    }
};

const hideFieldError = function(elem) {
    const inputContainer = elem.closest('.input-container');
    const fieldError = inputContainer.querySelector('.field-error');
    //jeżeli pobrane pole istnieje - usuń je
    if (fieldError !== null) {
        fieldError.remove();
    }


};

const checkFieldsErrors = function(elements) {
    //ustawiamy zmienną na true. Następnie robimy pętlę po wszystkich polach
    //jeżeli któreś z pól jest błędne, przełączamy zmienną na false.
    let fieldsAreValid = true;

    [...elements].forEach(elem => {
        if (elem.checkValidity()) {
            hideFieldError(elem);
            elem.classList.remove('error');
        } else {
            displayFieldError(elem);
            elem.classList.add('error');
            fieldsAreValid = false;
        }
    });

    return fieldsAreValid;
};

