import styles from "./Eventos.module.css";

export function Eventos({ title }) {
  return (
    <main className={styles.mainMacroprocessos}>
      <div className={styles.textMacro}>
        <p>{title}</p>
      </div>
    </main>
  );
}
