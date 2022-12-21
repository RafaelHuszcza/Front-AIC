import styles from "./Atividades.module.css";

export function Atividades({ title }) {
  return (
    <main className={styles.mainMacroprocessos}>
      <div className={styles.textMacro}>
        <p>{title}</p>
      </div>
    </main>
  );
}
