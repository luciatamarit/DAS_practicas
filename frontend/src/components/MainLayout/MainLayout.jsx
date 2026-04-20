import Header from "../Header";
import Footer from "../Footer";
import styles from "./styles.module.css";

export default function MainLayout({ children }) {
  return (
    <div className={styles.pageContainer}>
      <Header />
      <main className={styles.mainContent}>{children}</main>
      <Footer />
    </div>
  );
}
