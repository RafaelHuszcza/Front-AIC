import styles from "./Processos.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";

import { TableFooter } from "../Table/TableFooter/TableFooter";
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";
import { formatDate } from "../../helpers/dateFormatter";
import { DeleteBox } from "../DeleteBox/DeleteBox";

export function Processos({ title }) {
  const formRef = useRef();
  const formRef2 = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [error, setError] = useState("");
  const [changeProcessos, setChangeProcessos] = useState(false);
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [processoToDeleteId, setProcessoToDeleteId] = useState(null);
  const [processoToEdit, setProcessoToEdit] = useState({});

  const [id, setId] = useState(Date.now());
  const [processos, setProcessos] = useState(
    localStorage.getItem("@aic2:Processos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Processos"))
      : []
  );
  const [macroprocessos, setMacroprocessos] = useState(
    localStorage.getItem("@aic2:Macroprocessos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Macroprocessos"))
      : []
  );

  const loadProcessosLocalStorage = () => {
    setProcessos(JSON.parse(localStorage.getItem("@aic2:Processos")));
  };

  useEffect(() => {
    loadProcessosLocalStorage();
  }, [changeProcessos]);

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
        strategicObjectives: yup
          .string()
          .required("O Processo deve conter Objetivos estratégicos"),
        systems: yup.string().required("O Processo deve conter uma Data Final"),
        laws: yup
          .string()
          .required("O Processo deve conter Leis e Regulamentos"),
        periodEnd: yup
          .string()
          .required("O Processo deve conter uma Data Final"),
        periodStart: yup
          .string()
          .required("O Processo deve conter uma Data inicial"),
        responsible: yup
          .string()
          .required("O Processo deve conter ao menos um responsável"),
        manager: yup
          .string()
          .required("O Processo deve conter um Gestor responsável"),
        goal: yup.string().required("O Processo deve conter um Objetivo"),
        coordination: yup
          .string()
          .required("O Processo deve conter uma Diretoria/Coordenação"),
        organization: yup
          .string()
          .required("O Processo deve conter uma Organização/Unidade"),
        macroprocesso: yup
          .string()
          .required("O Processo deve conter um Macroprocesso vinculado"),
        name: yup.string().required("O Processo deve conter um nome"),
      });

      await schema.validate(inputValues);

      inputValues["id"] = id;
      inputValues["createdAt"] = new Date();
      let tempIdMacroprocessos = inputValues["macroprocesso"];
      for (let i in macroprocessos) {
        if (macroprocessos[i].id == tempIdMacroprocessos) {
          inputValues["macroprocesso"] = macroprocessos[i];
        }
      }
      setId(Date.now());
      setError("");
      let processosAll =
        processos != null ? [...processos, inputValues] : [inputValues];
      console.log(processosAll);
      localStorage.setItem("@aic2:Processos", JSON.stringify(processosAll));
      setChangeProcessos(!changeProcessos);
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
        strategicObjectives: yup
          .string()
          .required("O Processo deve conter Objetivos estratégicos"),
        systems: yup.string().required("O Processo deve conter uma Data Final"),
        laws: yup
          .string()
          .required("O Processo deve conter Leis e Regulamentos"),
        periodEnd: yup
          .string()
          .required("O Processo deve conter uma Data Final"),
        periodStart: yup
          .string()
          .required("O Processo deve conter uma Data inicial"),
        responsible: yup
          .string()
          .required("O Processo deve conter ao menos um responsável"),
        manager: yup
          .string()
          .required("O Processo deve conter um Gestor responsável"),
        goal: yup.string().required("O Processo deve conter um Objetivo"),
        coordination: yup
          .string()
          .required("O Processo deve conter uma Diretoria/Coordenação"),
        organization: yup
          .string()
          .required("O Processo deve conter uma Organização/Unidade"),

        macroprocesso: yup
          .string()
          .required("O Processo deve conter um Macroprocesso vinculado"),
        name: yup.string().required("O Processo deve conter um nome"),
      });

      await schema.validate(inputValues);

      let editing = { ...processoToEdit };

      for (let i in inputValues) {
        editing[i] = inputValues[i];
      }

      let tempIdMacroprocesso = inputValues["macroprocesso"];
      for (let i in macroprocessos) {
        if (macroprocessos[i].id == tempIdMacroprocesso) {
          inputValues["macroprocesso"] = macroprocessos[i];
        }
      }
      editing.macroprocesso = inputValues["macroprocesso"];
      editing["editedAt"] = new Date();
      setError("");

      let newProcessos = [...processos];
      for (let i in newProcessos) {
        if (newProcessos[i].id == editing.id) {
          newProcessos[i] = editing;
        }
      }

      localStorage.setItem("@aic2:Processos", JSON.stringify(newProcessos));
      setChangeProcessos(!changeProcessos);
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
  const deleteProcesso = async (isDeleteConfirmed) => {
    if (!isDeleteConfirmed) {
      setIsActionBoxOpen(false);
      return;
    }
    let newProcessos = [...processos];
    for (let i in newProcessos) {
      if (newProcessos[i].id == processoToDeleteId) {
        newProcessos.splice(i, 1);
      }
    }

    localStorage.setItem("@aic2:Processos", JSON.stringify(newProcessos));
    setCurrentPage(1);
    setChangeProcessos(!changeProcessos);

    setIsActionBoxOpen(false);
  };
  const styleModal = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const emptyRows =
    currentPage > 1
      ? Math.max(0, currentPage * 6 - processos.length)
      : processos
      ? 6 - processos.length
      : 6;
  const changePage = (type) => {
    if (processos.length != 0) {
      if (type === "increase") {
        if (Math.ceil(processos.length / 6) - currentPage >= 1) {
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
  };
  const handleCloseModalEdit = () => {
    setOpenModalEdit(false);
    setError("");
  };

  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={styles.modal} sx={{ ...styleModal }}>
          <h2 className={styles.modalHeader}>
            Adicionar Processos
          </h2>
          <form
            className={styles.formModal}
            id="addProcesso"
            onSubmit={onSubmit}
            ref={formRef}
          >
            <div className={styles.row}>
              <div className={styles.container}>
                <label htmlFor="name">Processos</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome do Processo..."
                />
              </div>
              <div className={styles.container}>
                <label
                  className={styles.seletorFirstHeader}
                >{`Macroprocesso`}</label>
                <select
                  name="macroprocesso"
                  id="macroprocesso"
                  className={styles.seletor}
                >
                  <option
                    className={styles.seletorLabel}
                    value=""
                    disable="disable"
                    hidden
                  >
                    Selecione o Macroprocesso relacionada
                  </option>

                  {macroprocessos.map((macroprocesso) => (
                    <option key={macroprocesso.id} value={macroprocesso.id}>
                      {macroprocesso.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.container}>
                <label htmlFor="organization">{`Orgão / Unidade`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="organization"
                  name="organization"
                  placeholder="Informe o órgão ou unidade responsável..."
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="coordination">{`Diretoria/Coordenação`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="coordination"
                  name="coordination"
                  placeholder="Informe a diretoria ou coordenação..."
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="goal">{`Objetivo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="goal"
                  name="goal"
                  placeholder="Descreva o objetivo do processo ..."
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="manager">{`Gestor Responsável Pelo Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="manager"
                  name="manager"
                  placeholder="Informe o gestor responsável..."
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="responsible">{`Responsáveis pela análise (Grupo de trabalho)`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="responsible"
                  name="responsible"
                  placeholder="Informe os responsáveis pela análise..."
                />
              </div>

              <div className={styles.containerDate}>
                <div className={styles.containerBigDate}>
                  <label htmlFor="periodStart">{`Inicio da Análise`}</label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    autoComplete="off"
                    id="periodStart"
                    name="periodStart"
                    placeholder="Data do início..."
                  />
                </div>
                <div className={styles.containerBigDate}>
                  <label htmlFor="periodEnd">{`Fim da Análise`}</label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    autoComplete="off"
                    id="periodEnd"
                    name="periodEnd"
                    placeholder="Data do fim..."
                  />
                </div>
              </div>
              <div className={styles.container}>
                <label htmlFor="laws">{`Leis e Regulamentos Relacionados ao Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="laws"
                  name="laws"
                  placeholder="Informe Leis e regulamentos..."
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="systems">{`Sistemas Tecnológicos que Apoiam o Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="systems"
                  name="systems"
                  placeholder="Informe sistemas tecnológicos que..."
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="strategicObjectives">{`Ligação com os objetivos estratégicos`}</label>
                <textarea
                  className={styles.textArea}
                  type="text"
                  autoComplete="off"
                  id="strategicObjectives"
                  name="strategicObjectives"
                  placeholder="Descreva o objetivo do processo..."
                />
              </div>
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="addProcesso"
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
            <p>Editar Processo</p>
          </div>
          <form
            className={styles.formModal}
            id="editProcesso"
            onSubmit={onSubmitEdit}
            ref={formRef2}
          >
            <div className={styles.row}>
              <div className={styles.container}>
                <label htmlFor="name">{`Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome do Processo..."
                  defaultValue={processoToEdit?.name}
                />
              </div>
              <div className={styles.container}>
                <label
                  className={styles.seletorFirstHeader}
                >{`Macroprocesso`}</label>
                <select
                  name="macroprocesso"
                  id="macroprocesso"
                  className={styles.seletor}
                  defaultValue={processoToEdit?.macroprocesso?.id}
                >
                  <option
                    className={styles.seletorLabel}
                    value=""
                    disable="disable"
                    hidden
                  >
                    Selecione o Macroprocesso relacionada
                  </option>

                  {macroprocessos.map((macroprocesso) => (
                    <option key={macroprocesso.id} value={macroprocesso.id}>
                      {macroprocesso.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.container}>
                <label htmlFor="organization">{`Orgão / Unidade`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="organization"
                  name="organization"
                  placeholder="Informe o nome da Orgão/Unidade..."
                  defaultValue={processoToEdit?.organization}
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="coordination">{`Diretoria/Coordenação`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="coordination"
                  name="coordination"
                  placeholder="Informe a diretoria ou coordenação..."
                  defaultValue={processoToEdit?.coordination}
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="goal">{`Objetivo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="goal"
                  name="goal"
                  placeholder="Descreva o objetivo do processo ..."
                  defaultValue={processoToEdit?.goal}
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="manager">{`Gestor Responsável Pelo Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="manager"
                  name="manager"
                  placeholder="Informe o gestor responsável..."
                  defaultValue={processoToEdit?.manager}
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="responsible">{`Responsáveis pela análise (Grupo de trabalho)`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="responsible"
                  name="responsible"
                  placeholder="Informe os responsáveis pela análise..."
                  defaultValue={processoToEdit?.responsible}
                />
              </div>

              <div className={styles.containerDate}>
                <div className={styles.containerBigDate}>
                  <label htmlFor="periodStart">{`Inicio da Análise`}</label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    autoComplete="off"
                    id="periodStart"
                    name="periodStart"
                    placeholder="Data do início..."
                    defaultValue={processoToEdit?.periodStart}
                  />
                </div>
                <div className={styles.containerBigDate}>
                  <label htmlFor="periodEnd">{`Fim da Análise`}</label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    autoComplete="off"
                    id="periodEnd"
                    name="periodEnd"
                    placeholder="Data do fim..."
                    defaultValue={processoToEdit?.periodEnd}
                  />
                </div>
              </div>
              <div className={styles.container}>
                <label htmlFor="laws">{`Leis e Regulamentos Relacionados ao Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="laws"
                  name="laws"
                  placeholder="Informe Leis e regulamentos..."
                  defaultValue={processoToEdit?.laws}
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="systems">{`Sistemas Tecnológicos que Apoiam o Processo`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="systems"
                  name="systems"
                  placeholder="Informe sistemas tecnológicos que..."
                  defaultValue={processoToEdit?.systems}
                />
              </div>
              <div className={styles.container}>
                <label htmlFor="strategicObjectives">{`Ligação com os objetivos estratégicos`}</label>
                <textarea
                  className={styles.textArea}
                  type="text"
                  autoComplete="off"
                  id="strategicObjectives"
                  name="strategicObjectives"
                  placeholder="Descreva o objetivo do processo..."
                  defaultValue={processoToEdit?.strategicObjectives}
                />
              </div>
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="editProcesso"
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

      <main className={styles.mainProcessos}>
        <div className={styles.topInformations}>
          <div className={styles.textProcessos}>
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
          <button
            className={styles.openModal}
            onClick={() => setOpenModal(true)}
          >
            Adicionar Processos
          </button>
        </div>
        <div className={styles.list}>
          {processos == undefined || processos.length == 0 ? (
            <div className={styles.loadingTable}></div>
          ) : (
            <div className={styles.tableDiv}>
              <table className={styles.table}>
                <thead className={styles.tbHeader}>
                  <tr>
                    <th className={styles.date}>Data de Criação</th>
                    <th>Orgão / Unidade </th>
                    <th>Titulo da Processo </th>
                    <th className={styles.macroprocess}>
                      Macroprocesso relacionado
                    </th>
                    <th className={styles.option}>Opções </th>
                  </tr>
                </thead>
                <tbody>
                  {processos != undefined && processos.length != 0
                    ? processos
                        .slice((currentPage - 1) * 6, (currentPage - 1) * 6 + 6)
                        .map((processo) => (
                          <tr key={processo.id}>
                            <td>{formatDate(processo.createdAt)}</td>
                            <td>{processo.organization}</td>
                            <td>{processo.name}</td>
                            <td>{processo.macroprocesso.name}</td>
                            <td>
                              <div className={styles.icons}>
                                <EditOutlined
                                  className={styles.iconsGap}
                                  onClick={() => {
                                    setProcessoToEdit(processo);
                                    setOpenModalEdit(true);
                                  }}
                                />

                                <DeleteOutlined
                                  className={styles.iconsGap}
                                  onClick={() => {
                                    setIsActionBoxOpen(!isActionBoxOpen);
                                    setProcessoToDeleteId(processo.id);
                                  }}
                                />

                                {processoToDeleteId === processo.id ? (
                                  <DeleteBox
                                    isOpen={isActionBoxOpen}
                                    action={deleteProcesso}
                                  />
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))
                    : null}

                  {emptyRows > 0 ? (
                    <tr style={{ height: `${12.5 * emptyRows}%` }}>
                      <td colSpan={5} />
                    </tr>
                  ) : null}
                </tbody>
              </table>
              <TableFooter
                data={processos.length}
                currentPage={currentPage}
                changePage={changePage}
                action={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
