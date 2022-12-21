import styles from "./Processos.module.css";

export function Processos({ title }) {
  return (
    <main className={styles.mainMacroprocessos}>
      <div className={styles.textMacro}>
        <p>{title}</p>
      </div>
    </main>
  );
}
