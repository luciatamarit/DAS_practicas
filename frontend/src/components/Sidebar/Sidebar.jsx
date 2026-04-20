import styles from "./styles.module.css";

export default function Sidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onCreateChat,
  onDeleteChat,
}) {
  return (
    <aside className={styles.chatSidebar}>
      <div className={styles.sidebarHeader}>
        <h3 className={styles.title}>Chats</h3>
        <button className={styles.createButton} onClick={onCreateChat}>
          Nuevo chat
        </button>
      </div>

      <div className={styles.chatList}>
        {chats.length === 0 ? (
          <p className={styles.emptyState}>No hay chats todavía.</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`${styles.chatListItem} ${
                selectedChatId === chat.id ? styles.active : ""
              }`}
            >
              <button
                className={styles.chatSelectButton}
                onClick={() => onSelectChat(chat.id)}
              >
                {chat.title || "Nuevo chat"}
              </button>

              <button
                className={styles.chatDeleteButton}
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
