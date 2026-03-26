document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8000/api/auth/login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();
        console.log("STATUS:", response.status);
        console.log("RESPUESTA LOGIN:", data);

        if (response.ok) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
            alert("Login correcto");
        } else {
            alert(JSON.stringify(data));
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
});