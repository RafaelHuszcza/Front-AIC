import styles from "./Analise.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";

import { CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";

export function Analise({ title }) {
  const formRef = useRef();

  const [selectEventToAnalyze, setSelectEventToAnalyze] = useState("");
  const [eventToAnalyze, setEventToAnalyze] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [error, setError] = useState("");

  const [id, setId] = useState(Date.now());

  const [eventos, setEventos] = useState(
    localStorage.getItem("@aic2:Eventos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Eventos"))
      : []
  );

  const loadEventosLocalStorage = () => {
    setEventos(JSON.parse(localStorage.getItem("@aic2:Eventos")));
  };

  useEffect(() => {
    loadEventosLocalStorage();
  }, []);

  const styleModal = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const inputValues = [...formRef.current.elements].reduce(
      (total, { name, value }) => {
        if (name) return { ...total, [name]: value };
        return total;
      },
      {}
    );
    delete inputValues["cause"];
    delete inputValues["type"];
    delete inputValues["consequence"];
    delete inputValues["source"];

    inputValues["causesAndConsequences"] = causesAndConsequencesArray;
    try {
      const schema = yup.object().shape({
        atividade: yup
          .string()
          .required("A Evento deve conter uma atividade vinculado"),
        name: yup.string().required("A atividade deve conter um nome"),
        causesAndConsequences: yup.array().of(
          yup.object().shape({
            cause: yup.string().required("É necessário colocar uma causa"),
            source: yup
              .string()
              .required("É necessário selecionar a fonte da causa"),
            consequence: yup
              .string()
              .required(
                "É necessário selecionar uma consequencia gerada pela causa"
              ),
            type: yup
              .string()
              .required(
                "É necessário selecionar um tipo associado a consequência"
              ),
          })
        ),
      });

      await schema.validate(inputValues);

      inputValues["id"] = id;
      inputValues["createdAt"] = new Date();
      let tempIdAtividade = inputValues["atividade"];
      for (let i in atividades) {
        if (atividades[i].id == tempIdAtividade) {
          inputValues["atividade"] = atividades[i];
        }
      }
      setId(Date.now());
      setError("");
      let eventosToSet =
        eventos != null ? [...eventos, inputValues] : [inputValues];
      localStorage.setItem("@aic2:Eventos", JSON.stringify(eventosToSet));
      console.log(eventosToSet);
      setChangeEventos(!changeEventos);
      handleCloseModal();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.errors[0]);
      } else {
        setError("");
        console.log(err);
      }
    }
  };

  const setOpenModalIfEvent = () => {
    if (selectEventToAnalyze != "") {
      for (let x in eventos) {
        if (eventos[x].id == selectEventToAnalyze) {
          setEventToAnalyze(eventos[x]);
        }
      }

      setOpenModal(true);
    } else {
      alert("Selecione um Evento para realizar a analise");
    }
  };

  return (
    <main className={styles.mainEventos}>
      {eventToAnalyze != "" ? (
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box className={styles.modal} sx={{ ...styleModal }}>
            <h2 className={styles.modalHeader}>Realizar analise</h2>
            <form id="analyze" onSubmit={onSubmit} ref={formRef}>
              <div className={styles.row}>
                {eventToAnalyze?.causesAndConsequences.map((block, index) => (
                  <div key={index} className={styles.leftContainer}>
                    <div className={styles.fakeCol}>
                      <label className={styles.labelSpan}>
                        Causa
                        <p>{block.cause}</p>
                      </label>
                    </div>
                    <div className={styles.leftContainer}>
                      <div className={styles.fakeCol}>
                        <label>
                          kkk
                          <input type="text"></input>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {/* {causesAndConsequencesArray.map((array, index) => (
                <div className={styles.blockDiv} key={index}>
                  <div className={styles.defaultContainer}>
                    <div className={styles.fakeCol}>
                      <h2 className={styles.seletorHeader}>Causas</h2>
                      <div key={index} className={styles.minContent}>
                        <input
                          className={styles.defaultInput}
                          type="text"
                          name="cause"
                          placeholder="Informe a causa do evento"
                          onChange={(e) => handleChangeSameValue(e, index)}
                        />
                      </div>
                    </div>

                    <div className={styles.fakeCol}>
                      <label className={styles.seletorHeader}>{`Fontes`}</label>
                      <div>
                        <select
                          onChange={(e) => handleChangeSameValue(e, index)}
                          className={styles.seletor}
                          name="type"
                          defaultValue={""}
                        >
                          <option
                            className={styles.seletorLabel}
                            value=""
                            disable="disable"
                            hidden
                          >
                            Selecione a fonte relacionada
                          </option>
                          <option value="Pessoas">Pessoas</option>
                          <option value="Processos">Processos</option>
                          <option value="Sistemas">Sistemas</option>
                          <option value="Infraestrutura">
                            Infraestrutura Física
                          </option>
                          <option value="Organizacional">
                            Estrutura Organizacional
                          </option>
                          <option value="Tecnologia">Tecnologia</option>
                          <option value="Eventos Externos">
                            Eventos Externos
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={styles.defaultContainer}>
                    <div className={styles.fakeCol}>
                      <label className={styles.seletorHeader}>
                        Consequências
                      </label>

                      <div>
                        <input
                          name="consequence"
                          className={styles.defaultInput}
                          type="text"
                          placeholder="Informe as consequências o evento"
                          onChange={(e) => handleChangeSameValue(e, index)}
                        />
                      </div>
                    </div>
                    <div className={styles.fakeCol}>
                      <label className={styles.seletorHeader}>{`Tipos`}</label>
                      <div>
                        <select
                          className={styles.seletor}
                          name="source"
                          onChange={(e) => handleChangeSameValue(e, index)}
                        >
                          <option
                            className={styles.seletorLabel}
                            value=""
                            disable="disable"
                            hidden
                          >
                            Selecione o tipo relacionado
                          </option>
                          <option value="Estrategico">
                            1-Risco Estrategico
                          </option>
                          <option value="Operacional">
                            2-Risco Operacional
                          </option>
                          <option value="Conformidades">
                            3-Risco de Conformidades
                          </option>
                          <option value="Financeiro">
                            4-Risco Financeiro/Orçamentário
                          </option>
                          <option value="Imagem">5-Risco de Imagem</option>
                          <option value="Integridade">
                            6-Risco de Integridade
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <DeleteOutlined
                    style={{
                      cursor: "pointer",
                      color: "black",
                      fontSize: "2rem",
                      marginLeft: "2rem",
                    }}
                    onClick={(e) => handleDeleteItemOfArray(e, index)}
                  />
                </div>
              ))} */}
              </div>
            </form>
            {error ? <div className={styles.error}>{error}</div> : null}
            <div className={styles.applyButton}>
              <button
                form="analyze"
                type="submit"
                className={styles.addButton}
                id={styles.applyButton}
              >
                Analisar
              </button>
            </div>
            <CloseOutlined
              className={styles.closeModal}
              onClick={handleCloseModal}
            />
          </Box>
        </Modal>
      ) : null}

      <div className={styles.topInformations}>
        <h1 className={styles.textEventos}>{title}</h1>
        <div style={{ marginLeft: "2rem" }}>
          <select
            name="evento"
            id="evento"
            className={styles.seletor}
            defaultValue=""
            onChange={(e) => setSelectEventToAnalyze(e.target.value)}
          >
            <option
              className={styles.seletorLabel}
              value=""
              disable="disable"
              hidden
            >
              Selecione o Evento para analisar
            </option>

            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.name}
              </option>
            ))}
          </select>
          <button
            className={styles.openModal}
            onClick={() => {
              setOpenModalIfEvent();
            }}
          >
            Analisar
          </button>
        </div>
      </div>
    </main>
  );
}
