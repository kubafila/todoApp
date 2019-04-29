const email = document.getElementById("email-text");
const logoutButton = document.getElementById("logout-button")

function logout() {
	localStorage.removeItem("userKey");





	window.location.href = "http://localhost:3000/";
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
