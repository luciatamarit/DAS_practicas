"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MainLayout from "../../components/MainLayout";
import { loginUser } from "../../services/auth";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const { response, data } = await loginUser({ username, password });

      console.log("STATUS:", response.status);
      console.log("RESPUESTA LOGIN:", data);

      if (response.ok) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        setSuccess("Login correcto.");
        router.push("/chat");
      } else {
        setError(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.card}>
        <h2 className={styles.title}>Iniciar sesión</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className={styles.linkText}>
          ¿No tienes cuenta? <Link href="/register">Regístrate</Link>
        </div>
      </div>
    </MainLayout>
  );
}
