import styles from "./Macroprocessos.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { TableFooter } from "../Table/TableFooter/TableFooter";
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";
import { formatDate } from "../../helpers/dateFormatter";
import { DeleteBox } from "../DeleteBox/DeleteBox";

export function Macroprocessos({ title }) {
  const formRef = useRef();

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [error, setError] = useState("");
  const [changeMacro, setChangeMacro] = useState(false);
  const [isActionBoxOpen, setIsActionBoxOpen] = useState(false);
  const [macroToDeleteId, setMacroToDeleteId] = useState(null);
  const [macroToEdit, setMacroToEdit] = useState({});

  const [id, setId] = useState(Date.now());

  const [macroprocessos, setMacroprocessos] = useState(
    localStorage.getItem("@aic2:Macroprocessos") != undefined
      ? JSON.parse(localStorage.getItem("@aic2:Macroprocessos"))
      : []
  );

  // async function loadMacroprocessos(page) {
  //   try {
  //     const config = generateAccess();
  //     let paramsWithpage = { params: { page: page } };
  //     const response = await api.get("Aqui vai a rota", paramsWithpage);

  //     setMacroprocessos(response.data.results);
  //     setIsLoaded(true);
  //   } catch (err) {
  //     setIsLoaded(true);
  //     console.log(err);
  //   }
  // }

  // useEffect(() => {
  //   loadMacroprocessos(currentPage);
  // }, [currentPage]);

  const loadMacroprocessosLocalStorage = () => {
    setMacroprocessos(JSON.parse(localStorage.getItem("@aic2:Macroprocessos")));
  };

  useEffect(() => {
    loadMacroprocessosLocalStorage();
  }, [changeMacro]);

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
        name: yup.string().required("A Macroprocesso deve conter um nome"),
      });

      await schema.validate(inputValues);
      inputValues["id"] = id;
      inputValues["createdAt"] = new Date();
      setId(Date.now());

      // const response = await api.post("url da api aqui", inputValues);
      setError("");
      let macro =
        macroprocessos != null
          ? [...macroprocessos, inputValues]
          : [inputValues];
      localStorage.setItem("@aic2:Macroprocessos", JSON.stringify(macro));
      setChangeMacro(!changeMacro);
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
    try {
      const schema = yup.object().shape({
        name: yup.string().required("A Macroprocesso deve conter um nome"),
      });

      await schema.validate(inputValues);
      let editing = { ...macroToEdit };
      editing.name = inputValues["name"];
      editing["editedAt"] = new Date();
      setError("");

      let newMacros = [...macroprocessos];
      for (let i in newMacros) {
        if (newMacros[i].id == editing.id) {
          newMacros[i] = editing;
        }
      }

      localStorage.setItem("@aic2:Macroprocessos", JSON.stringify(newMacros));
      setChangeMacro(!changeMacro);
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
  const deleteMacro = async (isDeleteConfirmed) => {
    if (!isDeleteConfirmed) {
      setIsActionBoxOpen(false);
      return;
    }
    let newMacros = [...macroprocessos];
    for (let i in newMacros) {
      if (newMacros[i].id == macroToDeleteId) {
        newMacros.splice(i, 1);
      }
    }

    localStorage.setItem("@aic2:Macroprocessos", JSON.stringify(newMacros));
    setCurrentPage(1);
    setChangeMacro(!changeMacro);

    setIsActionBoxOpen(false);
  };

  const styleModal = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  // const emptyRows = macroprocessos ? 6 - macroprocessos.length : 6;

  const emptyRows =
    currentPage > 1
      ? Math.max(0, currentPage * 6 - macroprocessos.length)
      : macroprocessos
      ? 6 - macroprocessos.length
      : 6;
  const changePage = (type) => {
    if (macroprocessos.length != 0) {
      if (type === "increase") {
        if (Math.ceil(macroprocessos.length / 6) - currentPage >= 1) {
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
            <p>Adicionar Macroprocesso</p>
          </div>
          <form id="addMacro" onSubmit={onSubmit} ref={formRef}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <label htmlFor="name">{`Macroprocesso`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome do Macroprocesso..."
                />
              </div>
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="addMacro"
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
            <p>Editar Macroprocesso</p>
          </div>
          <form id="editMacro" onSubmit={onSubmitEdit} ref={formRef}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <label htmlFor="name">{`Macroprocesso`}</label>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome do Macroprocesso..."
                  defaultValue={macroToEdit?.name}
                />
              </div>
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="editMacro"
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
      <main className={styles.mainMacroprocessos}>
        <div className={styles.topInformations}>
          <div className={styles.textMacro}>
            <p>{title}</p>
          </div>
          <button
            className={styles.openModal}
            onClick={() => setOpenModal(true)}
          >
            Adicionar Macroprocesso
          </button>
        </div>
        <div className={styles.list}>
          {macroprocessos == undefined || macroprocessos.length == 0 ? (
            <div className={styles.loadingTable}>
              {/* <Oval className={styles.loadingIcon} stroke="black" /> */}
            </div>
          ) : (
            <div className={styles.tableDiv}>
              <table className={styles.table}>
                <thead className={styles.tbHeader}>
                  <tr>
                    <th className={styles.date}>Data de Criação</th>
                    <th>Titulo do Macroprocesso </th>
                    <th className={styles.option}>Opções </th>
                  </tr>
                </thead>
                <tbody>
                  {macroprocessos != undefined && macroprocessos.length != 0
                    ? macroprocessos
                        .slice((currentPage - 1) * 6, (currentPage - 1) * 6 + 6)
                        .map((macroprocesso) => (
                          <tr key={macroprocesso.id}>
                            <td>{formatDate(macroprocesso.createdAt)}</td>
                            <td>{macroprocesso.name}</td>
                            <td>
                              <div className={styles.icons}>
                                <EditOutlined
                                  className={styles.iconsGap}
                                  onClick={() => {
                                    setMacroToEdit(macroprocesso);
                                    setOpenModalEdit(true);
                                  }}
                                />

                                <DeleteOutlined
                                  className={styles.iconsGap}
                                  onClick={() => {
                                    setIsActionBoxOpen(!isActionBoxOpen);
                                    setMacroToDeleteId(macroprocesso.id);
                                  }}
                                />

                                {macroToDeleteId === macroprocesso.id ? (
                                  <DeleteBox
                                    isOpen={isActionBoxOpen}
                                    action={deleteMacro}
                                  />
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))
                    : null}

                  {emptyRows > 0 ? (
                    <tr style={{ height: `${12.5 * emptyRows}%` }}>
                      <td colSpan={3} />
                    </tr>
                  ) : null}
                </tbody>
              </table>
              <TableFooter
                data={macroprocessos.length}
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
