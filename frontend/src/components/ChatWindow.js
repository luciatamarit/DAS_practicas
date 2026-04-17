import ChatMessage from "./ChatMessage";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  messages,
  onSendMessage,
  loadingMessages,
  sendingMessage,
  error,
  selectedChatId,
}) {
  return (
    <section className="chat-window">
      <div className="chat-window-header">
        <h3>{selectedChatId ? `Chat ${selectedChatId}` : "Selecciona un chat"}</h3>
      </div>

      <div className="messages-container">
        {error && <p className="error-text">{error}</p>}

        {!selectedChatId && !error && (
          <p className="empty-chat-text">Selecciona o crea un chat para empezar.</p>
        )}

        {loadingMessages && <p className="loading-text">Cargando mensajes...</p>}

        {!loadingMessages &&
          messages.map((message, index) => (
            <ChatMessage key={message.id ?? index} message={message} />
          ))}
      </div>

      <MessageInput onSend={onSendMessage} disabled={!selectedChatId || sendingMessage} />
    </section>
  );
}