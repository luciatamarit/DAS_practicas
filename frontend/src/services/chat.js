function getAuthHeaders() {
  const token = localStorage.getItem("access");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function getChats() {
  const response = await fetch("http://localhost:8000/api/chats/", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return { response, data };
}

export async function createChat(title) {
  const response = await fetch("http://localhost:8000/api/chats/", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  const data = await response.json();
  return { response, data };
}

export async function getChatMessages(chatId) {
  const response = await fetch(`http://localhost:8000/api/chats/${chatId}/messages/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return { response, data };
}

export async function sendMessage(chatId, content) {
  const response = await fetch(`http://localhost:8000/api/chats/${chatId}/messages/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ content }),
  });

  const data = await response.json();
  return { response, data };
}

export async function deleteChat(chatId) {
  const response = await fetch(`http://localhost:8000/api/chats/${chatId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { response, data };
}

export async function getUsage() {
  const response = await fetch("http://localhost:8000/api/usage/", {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();
  return { response, data };
}