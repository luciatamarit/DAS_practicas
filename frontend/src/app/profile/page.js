"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "../../components/MainLayout";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../../services/auth";
import { getUsage } from "../../services/chat";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [usage, setUsage] = useState(null);

  const [username, setUsername] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadProfileData = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const { response: profileResponse, data: profileData } = await getProfile();
        const { response: usageResponse, data: usageData } = await getUsage();

        if (profileResponse.ok) {
          setUser(profileData);
          setUsername(profileData.username);
        } else {
          setError("No se pudieron cargar tus datos.");
        }

        if (usageResponse.ok) {
          setUsage(usageData);
        } else {
          setError("No se pudo cargar el uso de mensajes.");
        }
      } catch (err) {
        console.error(err);
        setError("Error de conexión.");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [router]);

  const handleUpdateUsername = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("El nombre de usuario no puede estar vacío.");
      return;
    }

    try {
      setSavingUsername(true);

      const { response, data } = await updateProfile(username);

      if (response.ok) {
        setUser(data);
        setUsername(data.username);
        setSuccess("Nombre de usuario actualizado correctamente.");
      } else {
        setError("No se pudo actualizar el nombre de usuario.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión.");
    } finally {
      setSavingUsername(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setError("Todos los campos de contraseña son obligatorios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (newPassword.length <= 8) {
      setError("La nueva contraseña debe tener más de 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("La nueva contraseña debe tener al menos una mayúscula.");
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError("La nueva contraseña debe tener al menos una minúscula.");
      return;
    }

    try {
      setSavingPassword(true);

      const { response, data } = await changePassword(oldPassword, newPassword);

      if (response.ok) {
        setSuccess("Contraseña actualizada correctamente.");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.detail || "No se pudo cambiar la contraseña.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión.");
    } finally {
      setSavingPassword(false);
    }
  };

  const mensajesRestantes =
    usage ? usage.messages_limit - usage.messages_used : 0;

  return (
    <MainLayout>
      <div className="auth-card">
        <h2>Mi perfil</h2>

        {loading && <p>Cargando perfil...</p>}
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        {user && (
          <div className="auth-form">
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}

        {usage && (
          <div className="auth-form" style={{ marginTop: "20px" }}>
            <p><strong>Mensajes usados:</strong> {usage.messages_used}</p>
            <p><strong>Mensajes límite:</strong> {usage.messages_limit}</p>
            <p><strong>Mensajes restantes:</strong> {mensajesRestantes}</p>
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleUpdateUsername}
          style={{ marginTop: "20px" }}
        >
          <h3>Cambiar nombre de usuario</h3>

          <input
            type="text"
            placeholder="Nuevo nombre de usuario"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />

          <button type="submit" disabled={savingUsername}>
            {savingUsername ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>

        <form
          className="auth-form"
          onSubmit={handleChangePassword}
          style={{ marginTop: "20px" }}
        >
          <h3>Cambiar contraseña</h3>

          <input
            type="password"
            placeholder="Contraseña actual"
            value={oldPassword}
            onChange={(event) => setOldPassword(event.target.value)}
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />

          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />

          <button type="submit" disabled={savingPassword}>
            {savingPassword ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
