export async function registerUser({ username, email, password, confirmPassword }) {
  const response = await fetch("http://localhost:8000/api/users/register/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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