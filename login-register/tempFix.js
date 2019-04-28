const signUpBtn = document.getElementById('sing-up-enter');
const nameInput = document.getElementById("field-name");
const emailInput = document.getElementById("field-email");
const passwordInput = document.getElementById("field-password");

signUpBtn.addEventListener("click", ()=>{
	fetch("http://localhost:3000/api/users", {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: nameInput.value,
				email: emailInput.value,
				password: passwordInput.value
			})
		})
		.then(x => x.json())
		.then(x => console.log(x))
	})

