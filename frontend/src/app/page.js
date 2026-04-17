import MainLayout from "../components/MainLayout";
import Link from "next/link";

export default function Home() {
  return (
    <MainLayout>
      <div className="auth-card">
        <h2>Bienvenida</h2>
        <p>Frontend de la práctica 3.</p>
        <div className="auth-link">
          <Link href="/login">Ir a login</Link>
        </div>
        <div className="auth-link">
          <Link href="/register">Ir a registro</Link>
        </div>
      </div>
    </MainLayout>
  );
}
