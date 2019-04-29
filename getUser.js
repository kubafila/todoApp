const email = document.getElementById("email-text");
const logoutButton = document.getElementById("logout-button")

function logout() {
	localStorage.removeItem("userKey");

	alert("Wylogowno! przejdź na stornę logowania")


	////TUTAJ PODAĆ ADRES STRONY LOGOWANIA
	//window.location.href = "http://127.0.0.1:5500/login-register/";
}

if(localStorage.getItem("userKey")){
	fetch("http://localhost:3000/api/users/me", {
		method: 'get',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'x-auth-token': localStorage.getItem("userKey")
		}
	})
	.then(res => res.json())
	.then(res => email.innerText = res.name);
}
else{
	email.innerText="Nie zalogowano!";
	logout();
}

logoutButton.addEventListener("click", logout)
