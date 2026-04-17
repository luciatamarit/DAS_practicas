export default function ChatMessage({ message }) {
  const isUser =
    message.role === "user" ||
    message.sender === "user" ||
    message.is_user === true;

  return (
    <div className={`message-row ${isUser ? "user" : "bot"}`}>
      <div className={`message-bubble ${isUser ? "user" : "bot"}`}>
        {message.loading ? "Thinking..." : message.content}
      </div>
    </div>
  );
}