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