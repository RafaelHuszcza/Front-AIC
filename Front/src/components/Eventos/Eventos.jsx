import styles from "./Eventos.module.css";
import React, { useState } from "react";

export function Eventos({ title }) {
  const [popup, setPop] = useState(false);
  const [fontValue, setFontes] = useState();
  const [tipoValue, setTipos] = useState();

  const handleClickOpen = () => {
    setPop(!popup);
  };

  return (
    <main className={styles.mainEventos}>
      <div className={styles.textEventos}>
        <p>{title}</p>
      </div>
      <button className={styles.openEvents} onClick={handleClickOpen}>Adicionar Evento</button>

      <div>
        {popup?
        <div className={styles.backgroundPopup}> 
          <div className={styles.popup}>
            <div className={styles.popupHeader}>
              <p>Adicionar Evento</p>
            </div>       
            <div className={styles.seletorContainer}>
              <p className={styles.seletorFirstHeader}>{`Evento`}</p>
              <select value={fontValue} onChange={e=>setFontes(e.target.value)} className={styles.seletor}>
                <option disabled selected>Selecione a fonte relacionada</option>
                <option value="Pessoas">Pessoas</option>
                <option value="Processos">Processos</option>
                <option value="Sistemas">Sistemas</option>
                <option value="Infraestrutura">Infraestrutura Física</option>
                <option value="Organizacional">Estrutura Organizacional</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Eventos Externos">Eventos Externos</option>
              </select>

              <p className={styles.seletorHeader}>{`Tipo`}</p>
              <select value={tipoValue} onChange={e=>setTipos(e.target.value)} className={styles.seletor}>
                <option className={styles.seletorLabel} disabled selected>Selecione o tipo relacionado</option>
                <option value="Estrategico">1-Risco Estrategico</option>
                <option value="Operacional">2-Risco Operacional</option>
                <option value="Conformidades">3-Risco de Conformidades</option>
                <option value="Financeiro">4-Risco Financeiro/Orçamentário</option>
                <option value="Imagem">5-Risco de Imagem</option>
                <option value="Integridade">6-Risco de Integridade</option>
              </select>
            </div>
            <div className={styles.applyButton}>
              <button className={styles.addButton} id={styles.applyButton}>Adicionar</button>
            </div>
          </div>
        </div>:""}
      </div>
    </main>
  );
}
