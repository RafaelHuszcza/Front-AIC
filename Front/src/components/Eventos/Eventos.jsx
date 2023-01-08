import styles from "./Eventos.module.css";
import React, { useState } from "react";

export function Eventos({ title }) {
  const [fontValue, setFontes]=useState();
  const [tipoValue, setTipos]=useState();

  return (
    <main className={styles.mainEventos}>
      <div className={styles.textEventos}>
        <p>{title}</p>
      </div>

      <div className={styles.seletorContainer}>
        <p>{`Selecione a `}<b>{`FONTE`}</b>{` do evento`}</p>
        <select value={fontValue} onChange={e=>setFontes(e.target.value)} className={styles.seletor}>
          <option value="Pessoas">Pessoas</option>
          <option value="Processos">Processos</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Infraestrutura">Infraestrutura Física</option>
          <option value="Organizacional">Estrutura Organizacional</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="Eventos Externos">Eventos Externos</option>
        </select>
        <p>{`Voce selecionou: `}<b>{fontValue}</b></p>

        <p>{`Selecione o `}<b>{`TIPO`}</b>{` do evento`}</p>
        <select value={tipoValue} onChange={e=>setTipos(e.target.value)} className={styles.seletor}>
          <option value="Estrategico">1-Risco Estrategico</option>
          <option value="Operacional">2-Risco Operacional</option>
          <option value="Conformidades">3-Risco de Conformidades</option>
          <option value="Financeiro">4-Risco Financeiro/Orçamentário</option>
          <option value="Imagem">5-Risco de Imagem</option>
          <option value="Integridade">6-Risco de Integridade</option>
        </select>
        <p>{`Voce selecionou: `}<b>{tipoValue}</b></p>
      </div>
    </main>
  );
}
