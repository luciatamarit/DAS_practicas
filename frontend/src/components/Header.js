"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <h1>DAS Chat</h1>

      <nav>
        <Link href="/chat">Chat</Link>
        {" | "}
        <Link href="/profile">Perfil</Link>
      </nav>
    </header>
  );
}