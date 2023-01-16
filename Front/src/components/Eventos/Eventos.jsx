import styles from "./Eventos.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";

import { TableFooter } from "../Table/TableFooter/TableFooter";
import { CloseOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";
import { formatDate } from "../../helpers/dateFormatter";
import { DeleteBox } from "../DeleteBox/DeleteBox";

export function Eventos({ title }) {
  const MAX_CAUSA_CONSEQUENCIA_AMMOUNT = 3;

  const formRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [error, setError] = useState("");
  const [changeEventos, setChangeEventos] = useState(false);
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [eventoToDeleteId, setEventoToDeleteId] = useState(null);
  const [eventoToEdit, setEventoToEdit] = useState({});

  const [id, setId] = useState(Date.now());

  const [eventos, setEventos] = useState(
    localStorage.getItem("@aic2:Eventos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Eventos"))
      : []
  );
  const [atividades, setAtividades] = useState(
    localStorage.getItem("@aic2:Eventos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Eventos"))
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
    setError("");

    setConsequenciaList([{ consequencia: "" }])
    setCausaList([{ causa: "" }])
  };
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
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

    try {
      const schema = yup.object().shape({
        atividade: yup
          .string()
          .required("A atividade deve conter uma atividade vinculado"),
        name: yup.string().required("A atividade deve conter um nome"),
      });

      await schema.validate(inputValues);

      inputValues["id"] = id;
      inputValues["createdAt"] = new Date();
      let tempIdAtividade = inputValues["atividade"];
      for (let i in processos) {
        if (processos[i].id == tempIdProcesses) {
          let processoInput = processos[i];
          inputValues["processo"] = processoInput;
        }
      }
      setId(Date.now());
      setError("");
      let atividades = atvs != null ? [...atvs, inputValues] : [inputValues];
      localStorage.setItem("@aic2:Atividades", JSON.stringify(atividades));
      setChangeAtv(!changeAtv);
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

    const inputValues = [...formRef2.current.elements].reduce(
      (total, { name, value }) => {
        if (name) return { ...total, [name]: value };
        return total;
      },
      {}
    );

    try {
      const schema = yup.object().shape({
        processo: yup
          .string()
          .required("A atividade deve conter um processo vinculado"),
        name: yup.string().required("A Macroprocesso deve conter um nome"),
      });

      await schema.validate(inputValues);

      let editing = { ...atvToEdit };

      editing.name = inputValues["name"];

      let tempIdProcesses = inputValues["processo"];
      for (let i in processos) {
        if (processos[i].id == tempIdProcesses) {
          let processoInput = processos[i];

          inputValues["processo"] = processoInput;
        }
      }

      editing.processo = inputValues["processo"];
      editing["editedAt"] = new Date();
      setError("");

      let newAtvs = [...atvs];
      for (let i in newAtvs) {
        if (newAtvs[i].id == editing.id) {
          newAtvs[i] = editing;
        }
      }

      localStorage.setItem("@aic2:Atividades", JSON.stringify(newAtvs));
      setChangeAtv(!changeAtv);
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

  const [fontValue, setFontes] = useState();
  const [tipoValue, setTipos] = useState();

  const [causaList, setCausaList] = useState([{ causa: "" }]);

  const [consequenciaList, setConsequenciaList] = useState([
    { consequencia: "" }
  ]);

  const handleClickCausa = () => {
    setCausaList([...causaList, { causa: "" }]);
  };

  const handleClickConsequencia = () => {
    setConsequenciaList([...consequenciaList, { consequencia: "" }]);
  };

  return (
    <main className={styles.mainEventos}>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={styles.modal} sx={{ ...styleModal }}>
          <h2 className={styles.modalHeader}>Adicionar Evento</h2>
          <form id="addEventos" onSubmit={onSubmit} ref={formRef}>
            <div role='row' className={styles.row}>
              <div className={styles.leftContainer}>
                <div className={styles.fakeCol}>
                  <h2 className={styles.seletorHeader}>Evento</h2>
                  <input
                    className={styles.defaultInput}
                    type="text"
                    autoComplete="off"
                    id="Evento"
                    placeholder="Informe o nome do evento"
                  />
                </div>
                <div className={styles.fakeCol}>
                  <h2 className={styles.seletorHeader}>Atividade</h2>
                  <select
                    value={fontValue}
                    onChange={(e) => setFontes(e.target.value)}
                    className={styles.seletor}
                    required
                  >
                    <option
                      className={styles.seletorLabel}
                      disabled
                      selected
                      value=""
                    >
                      Selecione a atividade relacionada
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.defaultContainer}>
                <div className={styles.fakeCol}>
                  <h2 className={styles.seletorHeader}>Causas</h2>
                  {causaList.map((singleCausa, index) => (
                    <div key={index} className={styles.minContent}>
                      <input
                        className={styles.defaultInput}
                        type="text"
                        autoComplete="off"
                        id="Causa"
                        placeholder="Informe a causa do evento"
                        required
                      />
                      {causaList.length - 1 === index &&
                        causaList.length < MAX_CAUSA_CONSEQUENCIA_AMMOUNT && (
                          <button id="addCausa" onClick={handleClickCausa} className={styles.btnAddCausa}>
                            <button className={styles.addCausaConsequencia}>
                              <PlusOutlined size='13px' />
                              Adicionar mais uma causa
                            </button>
                          </button>
                        )}
                    </div>
                  ))}
                </div>

                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Fontes`}</p>
                  {causaList.map((singleCausa, index) => (
                    <div key={index}>
                      <select
                        value={fontValue}
                        onChange={(e) => setFontes(e.target.value)}
                        className={styles.seletor}
                        required
                      >
                        <option
                          className={styles.seletorLabel}
                          disabled
                          selected
                          value=""
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
                  ))}
                </div>
              </div>

              <div className={styles.defaultContainer}>
                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Consequências`}</p>
                  {consequenciaList.map((singleConsequencia, index) => (
                    <div key={index}>
                      <input
                        className={styles.defaultInput}
                        type="text"
                        autoComplete="off"
                        id="Consequencia"
                        placeholder="Informe as consequências o evento"
                        required
                      />
                      {consequenciaList.length - 1 === index &&
                        consequenciaList.length < 3 && (
                          <button 
                            onClick={handleClickConsequencia}
                            className={styles.addCausaConsequencia}>
                            <PlusOutlined size='13px' />
                            Adicionar mais uma consequência
                          </button>
                        )}
                    </div>
                  ))}
                </div>
                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Tipos`}</p>
                  {consequenciaList.map((singleConsequencia, index) => (
                    <div key={index}>
                      <select
                        value={tipoValue}
                        onChange={(e) => setTipos(e.target.value)}
                        className={styles.seletor}
                        required
                      >
                        <option
                          value=""
                          className={styles.seletorLabel}
                          disabled
                          selected
                        >
                          Selecione o tipo relacionado
                        </option>
                        <option value="Estrategico">1-Risco Estrategico</option>
                        <option value="Operacional">2-Risco Operacional</option>
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
                  ))}
                </div>
              </div>
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
          <div className={styles.modalHeader}>
            <p>Editar Eventos</p>
          </div>
          <form
            className={styles.formModal}
            id="editEventos"
            onSubmit={onSubmitEdit}
            ref={formRef}
          >
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <div className={styles.fakeCol}>
                  <p>{`Evento`}</p>
                  <input
                    className={styles.defaultInput}
                    type="text"
                    autoComplete="off"
                    id="Evento"
                    placeholder="Informe o nome do evento"
                  />
                </div>

                <div className={styles.fakeCol}>
                  <p>{`Atividade`}</p>
                  <select
                    value={fontValue}
                    onChange={(e) => setFontes(e.target.value)}
                    className={styles.seletor}
                    required
                  >
                    <option
                      className={styles.seletorLabel}
                      disabled
                      selected
                      value=""
                    >
                      Selecione a atividade relacionada
                    </option>
                  </select>
                </div>
              </div>

              <div className={styles.defaultContainer}>
                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Causas`}</p>
                  {causaList.map((singleCausa, index) => (
                    <div key={index}>
                      <input
                        className={styles.defaultInput}
                        type="text"
                        autoComplete="off"
                        id="Causa"
                        placeholder="Informe a causa do evento"
                        required
                      />
                      {causaList.length - 1 === index &&
                        causaList.length < MAX_CAUSA_CONSEQUENCIA_AMMOUNT && (
                          <span id="addCausa" onClick={handleClickCausa}>
                            <button className={styles.addCausaConsequencia}>
                              <PlusOutlined size='13px' />
                              Adicionar mais uma causa
                            </button>
                          </span>
                        )}
                    </div>
                  ))}
                </div>

                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Fontes`}</p>
                  {causaList.map((singleCausa, index) => (
                    <div key={index}>
                      <select
                        value={fontValue}
                        onChange={(e) => setFontes(e.target.value)}
                        className={styles.seletor}
                        required
                      >
                        <option
                          className={styles.seletorLabel}
                          disabled
                          selected
                          value=""
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
                  ))}
                </div>
              </div>

              <div className={styles.defaultContainer}>
                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Consequências`}</p>
                  {consequenciaList.map((singleConsequencia, index) => (
                    <div key={index}>
                      <input
                        className={styles.defaultInput}
                        type="text"
                        autoComplete="off"
                        id="Consequencia"
                        placeholder="Informe as consequências o evento"
                        required
                      />
                      {consequenciaList.length - 1 === index &&
                        consequenciaList.length < MAX_CAUSA_CONSEQUENCIA_AMMOUNT && (
                          <span
                            id="addConsequencia"
                            onClick={handleClickConsequencia}
                          >
                            <button className={styles.addCausaConsequencia}>
                              <PlusOutlined size='13px' />
                              Adicionar mais uma consequência
                            </button>
                          </span>
                        )}
                    </div>
                  ))}
                </div>
                <div className={styles.fakeCol}>
                  <p className={styles.seletorHeader}>{`Tipos`}</p>
                  {consequenciaList.map((singleConsequencia, index) => (
                    <div key={index}>
                      <select
                        value={tipoValue}
                        onChange={(e) => setTipos(e.target.value)}
                        className={styles.seletor}
                        required
                      >
                        <option
                          value=""
                          className={styles.seletorLabel}
                          disabled
                          selected
                        >
                          Selecione o tipo relacionado
                        </option>
                        <option value="Estrategico">1-Risco Estrategico</option>
                        <option value="Operacional">2-Risco Operacional</option>
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
                  ))}
                </div>
              </div>
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
