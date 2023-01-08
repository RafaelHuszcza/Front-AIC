import styles from "./Macroprocessos.module.css";

export function Macroprocessos({ title }) {
  return (
    <main className={styles.mainMacroprocessos}>
      <div className={styles.textMacro}>
        <p>{title}</p>
      </div>
    </main>
  );
}