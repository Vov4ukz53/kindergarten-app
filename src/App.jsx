import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Kindergartens from "./pages/Kindergartens";
import Menu from "./pages/Menu";
import Dashboard from "./pages/Dashboard";
import PrepareDishes from "./pages/PrepareDishes";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#eee" }}>
        <Link to="/" style={{ marginRight: "10px" }}>
          Przedszkola
        </Link>
        <Link to="/menu" style={{ marginRight: "10px" }}>
          Menu
        </Link>
        <Link to="/dashboard" style={{ marginRight: "10px" }}>
          Przydział posiłków
        </Link>
        <Link to="/prepare">Przygotowanie dań</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Kindergartens />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prepare" element={<PrepareDishes />} />
      </Routes>
    </Router>
  );
}

export default App;
