import styles from "./Atividades.module.css";
import React, { useRef, useEffect, useState } from "react";
import { Modal, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loading-icons";
import { TableFooter } from "../Table/TableFooter/TableFooter";
import { CloseOutlined } from "@ant-design/icons";
import * as yup from "yup";
import { ValidationError } from "yup";
import { formatDate } from "../../helpers/dateFormatter";


export function Atividades({ title }) {
    const navigate = useNavigate();
    const formRef = useRef();
  
    const [currentPage, setCurrentPage] = useState(1);
    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState("");
    const [changeatividade, setChangeatividade] = useState(false);
  
    // const [isLoaded, setIsLoaded] = useState(true);
    const [id, setId] = useState(
      localStorage.getItem("@aic2:atividades") != undefined
        ? JSON.parse(localStorage.getItem("@aic2:atividades")).length
        : 1
    );
  
    const [atividades, setatividades] = useState(
      localStorage.getItem("@aic2:atividades") != undefined
        ? JSON.parse(localStorage.getItem("@aic2:atividades"))
        : []
    );
  
    // async function loadatividades(page) {
    //   try {
    //     const config = generateAccess();
    //     let paramsWithpage = { params: { page: page } };
    //     const response = await api.get("Aqui vai a rota", paramsWithpage);
  
    //     setatividades(response.data.results);
    //     setIsLoaded(true);
    //   } catch (err) {
    //     setIsLoaded(true);
    //     console.log(err);
    //   }
    // }
  
    // useEffect(() => {
    //   loadatividades(currentPage);
    // }, [currentPage]);
  
    const loadatividadesLocalStorage = () => {
      setatividades(JSON.parse(localStorage.getItem("@aic2:atividades")));
    };
  
    useEffect(() => {
      loadatividadesLocalStorage();
    }, [changeatividade]);
  
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
          name: yup.string().required("A atividade deve conter um nome"),
        });
  
        await schema.validate(inputValues);
        inputValues["id"] = id;
        inputValues["createdAt"] = new Date();
        setId((prev) => prev + 1);
  
        // const response = await api.post("url da api aqui", inputValues);
        setError("");
        let atividade =
          atividades != null
            ? [...atividades, inputValues]
            : [inputValues];
        localStorage.setItem("@aic2:atividades", JSON.stringify(atividade));
        setChangeatividade(!changeatividade);
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
  
    const styleModal = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  
    const emptyRows = atividades ? 6 - atividades.length : 6;
  
    const changePage = (type) => {
      if (atividades.length != 0) {
        if (type === "increase") {
          if (Math.ceil(atividades.length / 6) - currentPage >= 1) {
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
  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className={styles.modal} sx={{ ...styleModal }}>
          <div className={styles.modalHeader}>
            <p>Adicionar Atividade</p>
          </div>
          <form id="addatividade" onSubmit={onSubmit} ref={formRef}>
            <div className={styles.row}>
              <div className={styles.leftContainer}>
                <label htmlFor="name">{`Atividade`}</label>
                <input required
                  className={styles.input}
                  type="text"
                  autoComplete="off"
                  id="name"
                  name="name"
                  placeholder="Informe o nome da Atividade..."
                />
                <label htmlFor="name">{`Processo`}</label>
                <select   required></select>
              </div>
              
                
                
              
            </div>
          </form>
          {error ? <div className={styles.error}>{error}</div> : null}
          <div className={styles.applyButton}>
            <button
              form="addatividade"
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
        <div className={styles.listDataSources}>
          {atividades == undefined || atividades.length == 0 ? (
            <div className={styles.loadingTable}>
              {/* <Oval className={styles.loadingIcon} stroke="black" /> */}
            </div>
          ) : (
            <div className={styles.tableDiv}>
              <table className={styles.table}>
                <thead className={styles.tbHeader}>
                  <tr>
                    <th className={styles.date}>Data de Criação</th>
                    <th>Nome </th>
                  </tr>
                </thead>
                <tbody>
                  {atividades != undefined && atividades.length != 0
                    ? atividades.map((atividade) => (
                        <tr key={atividade.id}>
                          <td>{formatDate(atividade.createdAt)}</td>
                          <td>{atividade.name}</td>
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
                data={atividades.length}
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
