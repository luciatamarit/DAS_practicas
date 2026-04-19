"use client";

import { useState } from "react"; // sirven para gusrar varlores que cambian en la pantalla : username, email, password...
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "../../components/MainLayout";
import { registerUser } from "../../services/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();  //  evita que el formulario recargue la pagina automaticamanete
    setError("");
    setSuccess("");

    if (
      !username.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("El email no tiene un formato válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      const { response, data } = await registerUser({
        username,
        email,
        password,
        confirmPassword,
      });

      console.log("STATUS:", response.status);
      console.log("RESPUESTA BACKEND:", data);

      if (response.ok) {
        setSuccess("Registro correcto.");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setError(JSON.stringify(data));
      }
    } catch (err) {
      console.error("ERROR DE CONEXIÓN:", err);
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="auth-card">
        <h2>Crear cuenta</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-link">
          ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
        </div>
      </div>
    </MainLayout>
  );
}