export async function registerUser({ username, email, password, confirmPassword }) {
  const response = await fetch("http://localhost:8000/api/users/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ //envia daos al frontend
      username,
      email,
      password1: password,
      password2: confirmPassword,
    }),
  });

  const data = await response.json();
  return { response, data };
}

export async function loginUser({ username, password }) {
  const response = await fetch("http://localhost:8000/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();
  return { response, data };
}
// estas 2 funciones anteriores pasan antes de etsra autenticaa , aun no tienes token 

export async function getProfile() {
  
  const token = localStorage.getItem("access"); // en el login, cuanod el usuaro entra bien guardamos el token con localStorage.setItem("acces, data.access)")
  //despies tenemos que recuperar ese token con getItem
  const response = await fetch("http://localhost:8000/api/users/profile/", { //tenemos que hacerle una peticion al backend 
   // lo que hace fetch es mandar una solicitud a esa url y esperra la respuesta dle backend 
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // l. Solo un usuario autenticado puede entrar. Entonces, cuando haces la petición, tienes que demostrar quién eres mandando el token.
    },
  });

  const data = await response.json(); // aqui se reocge el contnido de la repsuesta y lo convertimos a json
  return { response, data };
}
export async function updateProfile(username) {
  const token = localStorage.getItem("access"); //coge token
 
  const response = await fetch("http://localhost:8000/api/users/profile/", {  //manda peticion al backend
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
    }),
  });

  const data = await response.json();
  return { response, data };
}

export async function changePassword(oldPassword, newPassword) {
  const token = localStorage.getItem("access");

  const response = await fetch("http://localhost:8000/api/users/profile/password/", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      old_password: oldPassword,
      new_password: newPassword,
    }),
  });

  const data = await response.json();
  return { response, data };
}

