import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./content.css";
import axios from "axios";
import debounce from "lodash/debounce";
import { BASE_URL } from "../constant";

import data from "../data/year_average.json";

interface AverageData {
  [year: number]: number;
}
const yearAverage: AverageData = data;

type Movie = {
  title: string;
  rating: number;
  votes: number;
  year: number;
};

interface StarProps {
  score: number;
  average: number;
}

const Stars: React.FC<StarProps> = ({ score, average }) => {
  if (score - average >= 2) {
    return (
      <td className="star-td">
        <span className="star-yellow">&#9733;</span>
        <span className="star-yellow">&#9733;</span>
        <span className="star-yellow">&#9733;</span>
      </td>
    );
  } else if (score - average >= 1.5) {
    return (
      <td className="star-td">
        <span className="star-yellow">&#9733;</span>
        <span className="star-yellow">&#9733;</span>
      </td>
    );
  } else if (score - average >= 1) {
    return (
      <td className="star-td">
        <span className="star-yellow">&#9733;</span>
      </td>
    );
  } else {
    return <td className="star-td"></td>;
  }
};

const Movie = () => {
  const [input, setInput] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const prevInputRef = useRef<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    // Update the windowWidth state when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const debounceGetCandidates = useRef(
    debounce((value: string) => {
      axios
        .get(`${BASE_URL}/search/movie/${value}`)
        .then((response) => {
          const data: Array<Movie> = response.data;
          setMovies(data);
          prevInputRef.current = value;
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }, 500)
  ).current;
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };
  // move to movie detalpage
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const name = target.innerText;
    navigate(`./detail/${name}`);
  };

  useEffect(() => {
    if (input.length > 0 && input !== prevInputRef.current) {
      debounceGetCandidates(input);
    }
  }, [input, debounceGetCandidates]);

  return (
    <div className="content">
      <h2 className="find-header">Find Movie</h2>
      <input type="text" autoFocus value={input} onChange={handleInput}></input>
      {loading && input.length > 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="table-div">
          {/* Display the fetched data  - title,rating,vote, year */}
          {data && input.length > 0 && (
            <table>
              <thead>
                <tr className="header-tr">
                  <th>Title</th>
                  <th>Rating</th>
                  {windowWidth < 460 ? null : <th>Votes</th>}

                  <th>Year</th>
                  <th className="star-th">Star</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((movie, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "even" : "odd"}>
                      <td className="td-title" onClick={handleClick}>
                        {movie.title}
                      </td>
                      <td className="td-rating">
                        {movie.rating} ({yearAverage[movie.year].toFixed(1)})
                      </td>
                      {windowWidth < 460 ? null : (
                        <td className="votes-td">{movie.votes}</td>
                      )}
                      <td className="td-year">{movie.year}</td>
                      {
                        <Stars
                          score={movie.rating}
                          average={yearAverage[movie.year]}
                        />
                      }
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
export default Movie;
