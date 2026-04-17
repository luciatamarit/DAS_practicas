export default function Sidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
}) {
  return (
    <aside className="chat-sidebar">
      <div className="sidebar-header">
        <h3>Chats</h3>
        <button onClick={onCreateChat}>Nuevo chat</button>
      </div>

      <div className="chat-list">
        {chats.length === 0 ? (
          <p>No hay chats todavía.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-list-item ${selectedChatId === chat.id ? "active" : ""}`}
            >
              <button
                className="chat-select-button"
                onClick={() => onSelectChat(chat.id)}
              >
                {chat.title || `Chat ${chat.id}`}
              </button>

              <button
                className="chat-delete-button"
                onClick={() => onDeleteChat(chat.id)}
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}