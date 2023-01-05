import styles from "./Eventos.module.css";
import React, { useState } from "react";

export function Eventos({ title }) {
  const getInitialState = () => {
    const value = "Null";
    return value;
  };

  const [value, setValue] = useState(getInitialState);

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <main className={styles.mainEventos}>
      <div className={styles.textEventos}>
        <p>{title}</p>
      </div>
      <div className={styles.seletorContainer}>
        <p>{`Selecione a `}<b>{`FONTE`}</b></p>
        <select value={value} onChange={handleChange} className={styles.seletor}>
          <option value="Pessoas">Pessoas</option>
          <option value="Processos">Processos</option>
          <option value="Sistemas">Sistemas</option>
          <option value="Infra">Infraestrutura Física</option>
          <option value="EstruOrg">Estrutura Organizacional</option>
          <option value="Tecnologia">Tecnologia</option>
          <option value="EventosExt">Eventos Externos</option>
        </select>
        </div>

        <div className={styles.seletorContainer}>
        <p>{`Selecione o `}<b>{`TIPO`}</b></p>
        <select value={value} onChange={handleChange} className={styles.seletorTipo}>
          <option value="Estrategico">1-Risco Estrategico</option>
          <option value="Operacional">2-Risco Operacional</option>
          <option value="Conformidades">3-Risco de Conformidades</option>
          <option value="Financeiro">4-Risco Financeiro/Orçamentário</option>
          <option value="Imagem">5-Risco de Imagem</option>
          <option value="Integridade">6-Risco de Integridade</option>
        </select>
        </div>
    </main>
  );
}
