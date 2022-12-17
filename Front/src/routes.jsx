import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { None } from "./pages/None/None";

export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<None title={"None"} />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}
