document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            alert("Login correcto");
            window.location.href = "/home";
        } else {
            alert("Error: " + (data.message || "Credenciales incorrectas"));
        }

    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
});