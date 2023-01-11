import { RightOutlined, LeftOutlined } from "@ant-design/icons";

import styles from "./TableFooter.module.css";

export const TableFooter = ({ data, currentPage, changePage, action }) => {
  const SubmitValue = () => {
    let element = document.getElementById("pageValue").value;
    if (element >= 1) {
      if (element <= Math.ceil(data / 6)) {
        action(parseInt(element));
      }
    }
  };
  return (
    <div className={styles.tableFooter}>
      <div className={styles.tableFooterSelectPage}>
        <span>Ir para página especifica:</span>
        <input
          id="pageValue"
          type="number"
          className={styles.inputPage}
        ></input>
        <button
          type="button"
          className={styles.buttonPage}
          onClick={() => SubmitValue()}
        >
          Ir
        </button>
      </div>
      <div className={styles.tableFooterData}>
        <span className={styles.tableFooterSpan}>
          {currentPage} - de {Math.ceil(data / 6)}
        </span>

        <LeftOutlined
          style={{ opacity: currentPage !== 1 ? "1.0" : "0.4" }}
          onClick={() => {
            changePage("decrease");
          }}
        />
        <RightOutlined
          style={{
            opacity: currentPage < Math.ceil(data / 6) ? "1.0" : "0.4",
          }}
          onClick={() => {
            changePage("increase");
          }}
        />
      </div>
    </div>
  );
};
