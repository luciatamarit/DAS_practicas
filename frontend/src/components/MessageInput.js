import { useState } from "react";

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
    <form className="message-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Escribe un mensaje..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !message.trim()}>
        Enviar
      </button>
    </form>
  );
}