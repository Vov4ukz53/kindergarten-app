import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Kindergartens from "./pages/Kindergartens";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import PrepareDishes from "./pages/PrepareDishes";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/kindergarten-app/" style={{ marginRight: "10px" }}>
          Przedszkola
        </Link>
        <Link to="/kindergarten-app/menu" style={{ marginRight: "10px" }}>
          Menu
        </Link>
        <Link to="/kindergarten-app/dashboard" style={{ marginRight: "10px" }}>
          Przydział posiłków
        </Link>
        <Link to="/kindergarten-app/prepare">Przygotowanie dań</Link>
      </nav>
      <Routes>
        <Route path="/kindergarten-app/" element={<Kindergartens />} />
        <Route path="/kindergarten-app/menu" element={<Menu />} />
        <Route path="/kindergarten-app/dashboard" element={<Dashboard />} />
        <Route path="/kindergarten-app/prepare" element={<PrepareDishes />} />
      </Routes>
    </Router>
  );
}

export default App;
