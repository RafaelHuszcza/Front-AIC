import styles from "./Eventos.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";

import { TableFooter } from "../Table/TableFooter/TableFooter";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";
import { formatDate } from "../../helpers/dateFormatter";
import { DeleteBox } from "../DeleteBox/DeleteBox";

export function Eventos({ title }) {
  const formRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [error, setError] = useState("");
  const [changeEventos, setChangeEventos] = useState(false);
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [eventoToDeleteId, setEventoToDeleteId] = useState(null);
  const [eventoToEdit, setEventoToEdit] = useState({});
  const [causesAndConsequencesArray, setCausesAndConsequencesArray] = useState(
    []
  );

  const [id, setId] = useState(Date.now());

  const [eventos, setEventos] = useState(
    localStorage.getItem("@aic2:Eventos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Eventos"))
      : []
  );
  const [atividades, setAtividades] = useState(
    localStorage.getItem("@aic2:Atividades") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Atividades"))
      : []
  );

  const loadEventosLocalStorage = () => {
    setEventos(JSON.parse(localStorage.getItem("@aic2:Eventos")));
  };

  useEffect(() => {
    loadEventosLocalStorage();
  }, [changeEventos]);

  const deleteEvento = async (isDeleteConfirmed) => {
    if (!isDeleteConfirmed) {
      setIsActionBoxOpen(false);
      return;
    }
    let newEventos = [...eventos];
    for (let i in newEventos) {
      if (newEventos[i].id == eventoToDeleteId) {
        newEventos.splice(i, 1);
      }
    }
    localStorage.setItem("@aic2:Eventos", JSON.stringify(newEventos));
    setCurrentPage(1);
    setChangeEventos(!changeEventos);

    setIsActionBoxOpen(false);
  };

  const styleModal = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const emptyRows =
    currentPage > 1
      ? Math.max(0, currentPage * 6 - eventos.length)
      : eventos
      ? 6 - eventos.length
      : 6;

  const changePage = (type) => {
    if (eventos.length != 0) {
      if (type === "increase") {
        if (Math.ceil(eventos.length / 6) - currentPage >= 1) {
          setCurrentPage(currentPage + 1);
        }
      } else if (type === "decrease") {
        if (currentPage !== 1) setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCausesAndConsequencesArray([]);
    setError("");
  };
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setCausesAndConsequencesArray([]);
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

  const onSubmitEdit = async (e) => {
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
      let editing = { ...eventoToEdit };

      for (let i in inputValues) {
        editing[i] = inputValues[i];
      }

      let tempIdAtividades = inputValues["atividade"];
      for (let i in atividades) {
        if (atividades[i].id == tempIdAtividades) {
          inputValues["atividade"] = atividades[i];
        }
      }

      editing.atividade = inputValues["atividade"];
      editing["editedAt"] = new Date();
      setError("");

      let newEventos = [...eventos];
      for (let i in newEventos) {
        if (newEventos[i].id == editing.id) {
          newEventos[i] = editing;
        }
      }
      localStorage.setItem("@aic2:Eventos", JSON.stringify(newEventos));
      setChangeEventos(!changeEventos);
      handleCloseModalEdit();
    } catch (err) {
      if (err instanceof ValidationError) {
        setError(err.errors[0]);
      } else {
        setError("");
        console.log(err);
      }
    }
  };

  const handleAddCausesAndConsequencesArray = () => {
    setCausesAndConsequencesArray([
      ...causesAndConsequencesArray,
      { cause: "", source: "", consequence: "", type: "" },
    ]);
  };
  const handleDeleteItemOfArray = (e, position) => {
    setCausesAndConsequencesArray([
      ...causesAndConsequencesArray.filter((_, index) => index !== position),
    ]);
  };

  const handleChangeSameValue = (e, index) => {
    causesAndConsequencesArray[index][e.target.name] = e.target.value;
    setCausesAndConsequencesArray([...causesAndConsequencesArray]);
  };
  return (
    <main className={styles.mainEventos}>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={styles.modal} sx={{ ...styleModal }}>
          <h2 className={styles.modalHeader}>Adicionar Evento</h2>
          <form id="addEventos" onSubmit={onSubmit} ref={formRef}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <div className={styles.fakeCol}>
                  <label>Evento</label>
                  <input
                    className={styles.defaultInput}
                    type="text"
                    autoComplete="off"
                    id="name"
                    name="name"
                    placeholder="Informe o nome do evento"
                  />
                </div>

                <div className={styles.fakeCol}>
                  <label>Atividade</label>
                  <select
                    name="atividade"
                    id="atividade"
                    className={styles.seletor}
                    defaultValue=""
                  >
                    <option
                      className={styles.seletorLabel}
                      value=""
                      disable="disable"
                      hidden
                    >
                      Selecione a Atividade relacionada
                    </option>

                    {atividades.map((atividade) => (
                      <option key={atividade.id} value={atividade.id}>
                        {atividade.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className={styles.buttonAddBlock}
                type="button"
                onClick={() => handleAddCausesAndConsequencesArray()}
              >
                Adicionar Bloco
              </button>

              {causesAndConsequencesArray.map((array, index) => (
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
              ))}
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="addEventos"
              type="submit"
              className={styles.addButton}
              id={styles.applyButton}
            >
              Adicionar
            </button>
          </div>
          <CloseOutlined
            className={styles.closeModal}
            onClick={handleCloseModal}
          />
        </Box>
      </Modal>
      <Modal open={openModalEdit} onClose={handleCloseModalEdit}>
        <Box className={styles.modal} sx={{ ...styleModal }}>
          <h2 className={styles.modalHeader}>Editar Evento</h2>
          <form id="editEventos" onSubmit={onSubmitEdit} ref={formRef}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <div className={styles.fakeCol}>
                  <label>Evento</label>
                  <input
                    className={styles.defaultInput}
                    type="text"
                    autoComplete="off"
                    id="name"
                    name="name"
                    placeholder="Informe o nome do evento"
                    defaultValue={eventoToEdit?.name}
                  />
                </div>

                <div className={styles.fakeCol}>
                  <label>Atividade</label>
                  <select
                    name="atividade"
                    id="atividade"
                    className={styles.seletor}
                    defaultValue={eventoToEdit?.atividade?.id}
                  >
                    <option value="" disable="disable" hidden>
                      Selecione a Atividade relacionada
                    </option>

                    {atividades.map((atividade) => (
                      <option key={atividade.id} value={atividade.id}>
                        {atividade.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                className={styles.buttonAddBlock}
                type="button"
                onClick={() => handleAddCausesAndConsequencesArray()}
              >
                Adicionar Bloco
              </button>

              {causesAndConsequencesArray.map((block, index) => (
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
                          defaultValue={block.cause}
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
                          defaultValue={block.type}
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
                          defaultValue={block.consequence}
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
                          defaultValue={block.source}
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
              ))}
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="editEventos"
              type="submit"
              className={styles.addButton}
              id={styles.applyButton}
            >
              Editar
            </button>
          </div>
          <CloseOutlined
            className={styles.closeModal}
            onClick={handleCloseModalEdit}
          />
        </Box>
      </Modal>

      <div className={styles.topInformations}>
        <h1 className={styles.textEventos}>{title}</h1>
        <button className={styles.openModal} onClick={() => setOpenModal(true)}>
          Adicionar Eventos
        </button>
      </div>
      <div className={styles.list}>
        {eventos == undefined || eventos.length == 0 ? (
          <div className={styles.loadingTable}></div>
        ) : (
          <div className={styles.tableDiv}>
            <table className={styles.table}>
              <thead className={styles.tbHeader}>
                <tr>
                  <th className={styles.date}>Data de Criação</th>
                  <th>Titulo do Evento </th>
                  <th className={styles.process}>Atividade relacionado </th>
                  <th className={styles.option}>Opções </th>
                </tr>
              </thead>
              <tbody>
                {eventos != undefined && eventos.length != 0
                  ? eventos
                      .slice((currentPage - 1) * 6, (currentPage - 1) * 6 + 6)
                      .map((evento) => (
                        <tr key={evento.id}>
                          <td>{formatDate(evento.createdAt)}</td>
                          <td>{evento.name}</td>
                          <td>{evento.atividade.name}</td>
                          <td>
                            <div className={styles.icons}>
                              <EditOutlined
                                className={styles.iconsGap}
                                onClick={() => {
                                  setEventoToEdit(evento);
                                  setCausesAndConsequencesArray(
                                    evento.causesAndConsequences
                                  );
                                  setOpenModalEdit(true);
                                }}
                              />

                              <DeleteOutlined
                                className={styles.iconsGap}
                                onClick={() => {
                                  setIsActionBoxOpen(!isActionBoxOpen);
                                  setEventoToDeleteId(evento.id);
                                }}
                              />

                              {eventoToDeleteId === evento.id ? (
                                <DeleteBox
                                  isOpen={isActionBoxOpen}
                                  action={deleteEvento}
                                />
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      ))
                  : null}

                {emptyRows > 0 ? (
                  <tr style={{ height: `${12.5 * emptyRows}%` }}>
                    <td colSpan={4} />
                  </tr>
                ) : null}
              </tbody>
            </table>
            <TableFooter
              data={eventos.length}
              currentPage={currentPage}
              changePage={changePage}
              action={setCurrentPage}
            />
          </div>
        )}
      </div>
    </main>
  );
}
