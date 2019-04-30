
if(localStorage.getItem("userKey")){
	fetch("http://localhost:3000/api/users/me", {
			method: 'get',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'x-auth-token': localStorage.getItem("userKey")
			}
		})
		.then(res => {
			if (res.status == 200) {
				if (window.location.href != "http://localhost:3000/app/")
					window.location.href = "http://localhost:3000/app/"
			} 
			else
				logout();
		})
}

else
	logout();
		
function logout() {
	localStorage.removeItem("userKey");

	if (window.location.href !== "http://localhost:3000/login/")
		window.location.href = "http://localhost:3000/login/"
}
