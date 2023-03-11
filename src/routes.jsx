import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Analise } from "./components/Analise/Analise";
import { Atividades } from "./components/Atividades/Atividades";
import { Eventos } from "./components/Eventos/Eventos";
import { Macroprocessos } from "./components/Macroprocessos/Macroprocessos";
import { None } from "./components/None/None";
import { Processos } from "./components/Processos/Processos";

import { LayoutPage } from "./pages/LayoutPage/LayoutPage";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/Front-AIC"
          element={<LayoutPage Component={None} title={"Home"} />}
        />
        <Route
          path="/Front-AIC/macro-processos"
          element={
            <LayoutPage Component={Macroprocessos} title={"Macroprocessos"} />
          }
        />
        <Route
          path="/Front-AIC/processos"
          element={<LayoutPage Component={Processos} title={"Processos"} />}
        />
        <Route
          path="/Front-AIC/atividades"
          element={<LayoutPage Component={Atividades} title={"Atividades"} />}
        />
        <Route
          path="/Front-AIC/eventos"
          element={<LayoutPage Component={Eventos} title={"Eventos"} />}
        />
        <Route
          path="/Front-AIC/analise"
          element={<LayoutPage Component={Analise} title={"Análise"} />}
        />
        {/* <Route
          path="*"
          element={
            <LayoutPage Component={None} title={"Página Não Encontrada"} />
          }
        /> */}
      </Routes>
    </Router>
  );
}
