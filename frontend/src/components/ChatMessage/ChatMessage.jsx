import styles from "./styles.module.css";

export default function ChatMessage({ message }) {
  const isUser =
    message.role === "user" ||
    message.sender === "user" ||
    message.is_user === true;

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.userRow : styles.botRow}`}>
      <div
        className={`${styles.messageBubble} ${
          isUser ? styles.userBubble : styles.botBubble
        }`}
      >
        {message.loading ? "Thinking..." : message.content}
      </div>
    </div>
  );
}
