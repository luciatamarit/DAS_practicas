"use client";

import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import Sidebar from "../../components/Sidebar";
import ChatWindow from "../../components/ChatWindow";
import styles from "./chat.module.css";
import {
  createChat,
  deleteChat,
  getChatMessages,
  getChats,
  sendMessage,
} from "../../services/chat";

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState("");
  const selectedChat = chats.find((chat) => chat.id === selectedChatId) ?? null;

  const loadChats = async () => {
    try {
      setLoadingChats(true);
      const { response, data } = await getChats();

      if (response.ok) {
        setChats(Array.isArray(data) ? data : data.results || []);
      } else {
        setError("No se pudieron cargar los chats.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar los chats.");
    } finally {
      setLoadingChats(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      setError("");
      setLoadingMessages(true);

      const { response, data } = await getChatMessages(chatId);

      if (response.ok) {
        setMessages(Array.isArray(data) ? data : data.results || []);
      } else {
        setError("No se pudieron cargar los mensajes del chat.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar los mensajes.");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadChats();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleSelectChat = async (chatId) => {
    setSelectedChatId(chatId);
    await loadMessages(chatId);
  };

  const handleCreateChat = async () => {
    try {
      setError("");

      const requestedTitle = window.prompt("Escribe un título para el chat", "Nuevo chat");

      if (requestedTitle === null) {
        return;
      }

      const title = requestedTitle.trim() || "Nuevo chat";
      const { response, data } = await createChat(title);

      if (response.ok) {
        await loadChats();
        const newChatId = data.id;
        setSelectedChatId(newChatId);
        await loadMessages(newChatId);
      } else {
        console.log("ERROR CREATE CHAT:", data);
        setError(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al crear el chat.");
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      setError("");
      const { response } = await deleteChat(chatId);

      if (response.ok || response.status === 204) {
        if (selectedChatId === chatId) {
          setSelectedChatId(null);
          setMessages([]);
        }
        await loadChats();
      } else {
        setError("No se pudo borrar el chat.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al borrar el chat.");
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedChatId || !content.trim()) {
      return;
    }

    const tempUserMessage = {
      id: Date.now(),
      content,
      role: "user",
    };

    const tempLoadingMessage = {
      id: Date.now() + 1,
      content: "",
      role: "assistant",
      loading: true,
    };

    setMessages((prev) => [...prev, tempUserMessage, tempLoadingMessage]);

    try {
      setSendingMessage(true);
      setError("");

      const { response, data } = await sendMessage(selectedChatId, content);

      if (response.ok) {
        await loadMessages(selectedChatId);
        await loadChats();
      } else {
        setMessages((prev) => prev.filter((msg) => !msg.loading));
        setError("No se pudo enviar el mensaje.");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((msg) => !msg.loading));
      setError("Error de conexión al enviar el mensaje.");
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <MainLayout>
      <div className={styles.page}>
        <Sidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onCreateChat={handleCreateChat}
          onDeleteChat={handleDeleteChat}
        />

        <div className={styles.chatMain}>
          {loadingChats ? (
            <p className={styles.loadingText}>Cargando chats...</p>
          ) : (
            <ChatWindow
              messages={messages}
              onSendMessage={handleSendMessage}
              loadingMessages={loadingMessages}
              sendingMessage={sendingMessage}
              error={error}
              selectedChatId={selectedChatId}
              selectedChatTitle={selectedChat?.title || "Nuevo chat"}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
