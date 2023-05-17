import "./App.css";
import Header from "./components/Header";
import Star from "./components/Star";
import StarDetail from "./components/StarDetail";
import Movie from "./components/Movie";
import MovieDetail from "./components/MovieDetail";
import Director from "./components/Director";
import DirectorDetail from "./components/DirectorDetail";
import WatchList from "./components/WatchList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router basename="findit2">
        <Header />
        <Routes>
          <Route path="/" element={<Director />} />
          <Route path="/detail/:name" element={<DirectorDetail />} />
          <Route path="/movie" element={<Movie />} />
          <Route path="/movie/detail/:title" element={<MovieDetail />} />
          <Route path="/star" element={<Star />} />
          <Route path="/star/detail/:name" element=<StarDetail /> />
          <Route path="/watchlist" element=<WatchList /> />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
