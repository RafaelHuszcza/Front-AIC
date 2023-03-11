import styles from './DeleteBox.module.css'

export function DeleteBox({ isOpen=false, action}){
  return(
    <div className={styles.deleteContainer} style={{visibility: isOpen ? 'visible': 'hidden'}} >
      <div className={styles.deleteBox}>
        <span>Deseja realmente excluir?</span>
        <div className={styles.deleteButtonsContainer}>
          <button className={styles.confirmButton} onClick={()=>{action(true)}}>
            Confirmar
          </button>
          <button className={styles.cancelButton} onClick={()=>{action(false)}}>
            Cancelar
          </button>
        </div>
      </div>
      <div className={styles.arrowdown}>
    </div>
    </div>
  )
}