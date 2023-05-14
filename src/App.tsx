import "./App.css";
import Header from "./components/Header";
import Star from "./components/Star";
import Movie from "./components/Movie";
import Director from "./components/Director";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router basename="findit">
        <Header />
        <Routes>
          <Route path="/" element={<Director />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/star" element={<Star />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
