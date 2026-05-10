import { useState } from "react";
import styles from "./styles.module.css";

export default function MessageInput({ onSend, disabled }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    onSend(message);
    setMessage("");
  };

  return (
    <form className={styles.messageInputForm} onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
      />
      <button
        className={styles.submitButton}
        type="submit"
        disabled={disabled || !message.trim()}
      >
        Enviar
      </button>
    </form>
  );
}
