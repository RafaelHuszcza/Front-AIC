import styles from "./None.module.css";

export function None({ title }) {
  return (
    <div className={styles.centralText}>
      <h1>{title}</h1>
    </div>
  );
}
