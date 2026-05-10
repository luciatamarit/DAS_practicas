import ChatMessage from "../ChatMessage";
import MessageInput from "../MessageInput";
import styles from "./styles.module.css";

export default function ChatWindow({
  messages,
  onSendMessage,
  loadingMessages,
  sendingMessage,
  error,
  selectedChatId,
  selectedChatTitle,
}) {
  return (
    <section className={styles.chatWindow}>
      <div className={styles.chatWindowHeader}>
        <h3 className={styles.title}>
          {selectedChatId ? selectedChatTitle : "Selecciona un chat"}
        </h3>
      </div>

      <div className={styles.messagesContainer}>
        {error && <p className={styles.errorText}>{error}</p>}

        {!selectedChatId && !error && (
          <p className={styles.emptyChatText}>
            Selecciona o crea un chat para empezar.
          </p>
        )}

        {loadingMessages && (
          <p className={styles.loadingText}>Cargando mensajes...</p>
        )}

        {!loadingMessages &&
          messages.map((message, index) => (
            <ChatMessage key={message.id ?? index} message={message} />
          ))}
      </div>

      <MessageInput
        onSend={onSendMessage}
        disabled={!selectedChatId || sendingMessage}
      />
    </section>
  );
}
