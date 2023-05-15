import "./App.css";
import Header from "./components/Header";
import Star from "./components/Star";
import StarDetail from "./components/StarDetail";
import Movie from "./components/Movie";
import Director from "./components/Director";
import DirectorDetail from "./components/DirectorDetail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router basename="findit">
        <Header />
        <Routes>
          <Route path="/" element={<Director />} />
          <Route path="/detail/:name" element={<DirectorDetail />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/star" element={<Star />} />
          <Route path="/star/detail/:name" element=<StarDetail /> />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
