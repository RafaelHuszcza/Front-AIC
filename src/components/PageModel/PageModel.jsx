import { Header } from "../Header/Header";
import styles from "./PageModel.module.css";

export function PageModel({ title, Component }) {
  return (
    <main className={styles.pageModelStyle}>
      <Header />
      <Component title={title} />
    </main>
  );
}
