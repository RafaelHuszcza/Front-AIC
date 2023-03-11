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
            {eventos != null
              ? eventos.map((evento) => (
                  <option key={evento.id} value={evento.id}>
                    {evento.name}
                  </option>
                ))
              : null}
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
