document.getElementById("registerForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("confirm_password").value;

    if (password !== password2) {
        alert("Las contraseñas no coinciden");
        return;
    }

    try {
        const response = await fetch("http://localhost:8000/api/users/register/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                            username,
                            email,
                            password1: password,
                            password2: password2
                        })
        });

        const data = await response.json();
        
        console.log("STATUS:", response.status);
        console.log("RESPUESTA BACKEND:", data);

        if (response.ok) {
            alert("Registro correcto");
            console.log("Registro correcto");
            window.location.href = "login.html";
        } else {
            alert(JSON.stringify(data));
        }

    } catch (error) {
        console.error("ERROR DE CONEXIÓN:", error);
        alert("Error de conexión");
    }
});