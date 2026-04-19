import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }) {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
// MainLayout devuelve esa estrcutura 
//arriba el header, en medio el contenido de la pagina y abajo el Footer


