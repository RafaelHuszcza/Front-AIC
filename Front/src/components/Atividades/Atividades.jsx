import styles from "./Atividades.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { TableFooter } from "../Table/TableFooter/TableFooter";
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";
import { formatDate } from "../../helpers/dateFormatter";
import { DeleteBox } from "../DeleteBox/DeleteBox";

export function Atividades({ title }) {
  const formRef = useRef();
  const formRef2 = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [error, setError] = useState("");
  const [changeAtv, setChangeAtv] = useState(false);
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [atvToDeleteId, setAtvToDeleteId] = useState(null);
  const [atvToEdit, setAtvToEdit] = useState({});

  const [id, setId] = useState(
    localStorage.getItem("@aic2:Atividades") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Atividades")).length + 1
      : 1
  );

  const [atvs, setAtvs] = useState(
    localStorage.getItem("@aic2:Atividades") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Atividades"))
      : []
  );
  const [processos, setProcessos] = useState(
    localStorage.getItem("@aic2:Processos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Processos"))
      : []
  );

  const loadAtividadesLocalStorage = () => {
    setAtvs(JSON.parse(localStorage.getItem("@aic2:Atividades")));
  };

  useEffect(() => {
    loadAtividadesLocalStorage();
  }, [changeAtv]);

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
        processo: yup
          .string()
          .required("A atividade deve conter um processo vinculado"),
        name: yup.string().required("A atividade deve conter um nome"),
      });

      await schema.validate(inputValues);

      inputValues["id"] = id;
      inputValues["createdAt"] = new Date();
      let tempIdProcesses = inputValues["processo"];
      for (let i in processos) {
        if (processos[i].id == tempIdProcesses) {
          let processoInput = processos[i];
          inputValues["processo"] = processoInput;
        }
      }
      setId((prev) => prev + 1);
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
  const deleteAtv = async (isDeleteConfirmed) => {
    if (!isDeleteConfirmed) {
      setIsActionBoxOpen(false);
      return;
    }
    let newAtvs = [...atvs];
    for (let i in newAtvs) {
      if (newAtvs[i].id == atvToDeleteId) {
        newAtvs.splice(i, 1);
      }
    }

    localStorage.setItem("@aic2:Atividades", JSON.stringify(newAtvs));
    setCurrentPage(1);
    setChangeAtv(!changeAtv);

    setIsActionBoxOpen(false);
  };
  const styleModal = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const emptyRows =
    currentPage > 1
      ? Math.max(0, currentPage * 6 - atvs.length)
      : atvs
      ? 6 - atvs.length
      : 6;
  const changePage = (type) => {
    if (atvs.length != 0) {
      if (type === "increase") {
        if (Math.ceil(atvs.length / 6) - currentPage >= 1) {
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
          <div className={styles.modalHeader}>
            <p>Adicionar Atividade</p>
          </div>
          <form id="addAtividade" onSubmit={onSubmit} ref={formRef}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <label htmlFor="name">{`Atividade`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome da Atividade..."
                />
              </div>
              <div className={styles.leftContainer}>
                <label
                  className={styles.seletorFirstHeader}
                >{`Processo`}</label>
                <select
                  name="processo"
                  id="processo"
                  className={styles.seletor}
                >
                  <option
                    className={styles.seletorLabel}
                    value=""
                    disable="disable"
                    hidden
                  >
                    Selecione o Processo relacionada
                  </option>

                  {processos.map((processo) => (
                    <option key={processo.id} value={processo.id}>
                      {processo.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              htmlFor="addAtividade"
              form="addAtividade"
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
            <p>Editar Atividade</p>
          </div>
          <form id="editAtividade" onSubmit={onSubmitEdit} ref={formRef2}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <label htmlFor="name">{`Atividade`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome da Atividade..."
                  defaultValue={atvToEdit?.name}
                />
              </div>
              <div className={styles.leftContainer}>
                <label
                  className={styles.seletorFirstHeader}
                >{`Processo`}</label>
                <select
                  name="processo"
                  id="processo"
                  className={styles.seletor}
                  defaultValue={atvToEdit?.processo?.id}
                >
                  <option
                    className={styles.seletorLabel}
                    value=""
                    disable="disable"
                    hidden
                  >
                    Selecione o Processo relacionada
                  </option>

                  {processos.map((processo) => (
                    <option key={processo.id} value={processo.id}>
                      {processo.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="editAtividade"
              type="submit"
              className={styles.addButton}
              id={styles.applyButton}
              onClick={() => console.log("")}
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

      <main className={styles.mainAtividades}>
        <div className={styles.topInformations}>
          <div className={styles.textAtividades}>
            <p>{title}</p>
          </div>
          <button
            className={styles.openModal}
            onClick={() => setOpenModal(true)}
          >
            Adicionar Atividade
          </button>
        </div>
        <div className={styles.list}>
          {atvs == undefined || atvs.length == 0 ? (
            <div className={styles.loadingTable}></div>
          ) : (
            <div className={styles.tableDiv}>
              <table className={styles.table}>
                <thead className={styles.tbHeader}>
                  <tr>
                    <th className={styles.date}>Data de Criação</th>
                    <th>Titulo da Atividade </th>
                    <th className={styles.process}>Processo relacionado </th>
                    <th className={styles.option}>Opções </th>
                  </tr>
                </thead>
                <tbody>
                  {atvs != undefined && atvs.length != 0
                    ? atvs
                        .slice((currentPage - 1) * 6, (currentPage - 1) * 6 + 6)
                        .map((atividade) => (
                          <tr key={atividade.id}>
                            <td>{formatDate(atividade.createdAt)}</td>
                            <td>{atividade.name}</td>
                            <td>{atividade.processo.name}</td>
                            <td>
                              <div className={styles.icons}>
                                <EditOutlined
                                  className={styles.iconsGap}
                                  onClick={() => {
                                    setAtvToEdit(atividade);
                                    setOpenModalEdit(true);
                                  }}
                                />

                                <DeleteOutlined
                                  className={styles.iconsGap}
                                  onClick={() => {
                                    setIsActionBoxOpen(!isActionBoxOpen);
                                    setAtvToDeleteId(atividade.id);
                                  }}
                                />

                                {atvToDeleteId === atividade.id ? (
                                  <DeleteBox
                                    isOpen={isActionBoxOpen}
                                    action={deleteAtv}
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
                data={atvs.length}
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
