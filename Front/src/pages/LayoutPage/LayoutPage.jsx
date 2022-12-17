import { NavBar } from "../../components/NavBar/NavBar";
import { PageModel } from "../../components/PageModel/PageModel";
import styles from "./LayoutPage.module.css";

export function LayoutPage({ title, Component }) {
  return (
    <div className={styles.layoutPage}>
      <NavBar />
      <PageModel title={title} Component={Component} />
    </div>
  );
}
