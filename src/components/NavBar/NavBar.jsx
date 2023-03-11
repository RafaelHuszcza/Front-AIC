import styles from "./NavBar.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function NavBar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const toggleOpen = () => {
    setOpen(!open);
  };
  return (
    <nav className={open ? styles.sideNav : styles.sideNavCollapsed}>
      <div className={open ? styles.divBtn : styles.divBtnCollapsed}>
        <button className={styles.btn} onClick={toggleOpen}>
          <RxHamburgerMenu />
        </button>
      </div>
      <div className={open ? styles.menuItemsVisible : styles.menuItems}>
        <span
          className={styles.linkText}
          onClick={() => {
            navigate("/Front-AIC/macro-processos");
          }}
        >
          Macroprocessos
        </span>

        <span
          className={styles.linkText}
          onClick={() => {
            navigate("/Front-AIC/processos");
          }}
        >
          Processos
        </span>

        <span
          className={styles.linkText}
          onClick={() => {
            navigate("/Front-AIC/atividades");
          }}
        >
          Atividades
        </span>

        <span
          className={styles.linkText}
          onClick={() => {
            navigate("/Front-AIC/eventos");
          }}
        >
          Eventos
        </span>
        <span
          className={styles.linkText}
          onClick={() => {
            navigate("/Front-AIC/analise");
          }}
        >
          Analise
        </span>
      </div>
    </nav>
  );
}
