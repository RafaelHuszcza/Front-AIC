import styles from "./Header.module.css";
import Logo from "../../assets/LogoHeader.png";

export function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={Logo} alt="Logo da Furg" />

      <span className={styles.spanText}>
        Universidade Federal do Rio Grande
      </span>
    </header>
  );
}
