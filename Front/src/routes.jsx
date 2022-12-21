import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
          path="/"
          element={<LayoutPage Component={None} title={"Home"} />}
        />
        <Route
          path="/macro-processos"
          element={
            <LayoutPage Component={Macroprocessos} title={"Macroprocessos"} />
          }
        />
        <Route
          path="/processos"
          element={<LayoutPage Component={Processos} title={"Processos"} />}
        />
        <Route
          path="/atividades"
          element={<LayoutPage Component={Atividades} title={"Atividades"} />}
        />
        <Route
          path="/eventos"
          element={<LayoutPage Component={Eventos} title={"Eventos"} />}
        />
        <Route
          path="*"
          element={
            <LayoutPage Component={None} title={"Página Não Encontrada"} />
          }
        />
      </Routes>
    </Router>
  );
}
