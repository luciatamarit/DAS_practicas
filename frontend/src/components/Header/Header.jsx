"use client";

import Link from "next/link";
import styles from "./styles.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <h1 className={styles.title}>DAS Chat</h1>

        <nav className={styles.nav}>
          <Link className={styles.link} href="/chat">
            Chat
          </Link>
          <span className={styles.separator}>|</span>
          <Link className={styles.link} href="/profile">
            Perfil
          </Link>
        </nav>
      </div>
    </header>
  );
}
