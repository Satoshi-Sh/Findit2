import "./watchlist.css";
import { SimpleData } from "./MovieDetail";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { produce } from "immer";

export const retrieveLocal = () => {
  const movieDataString = localStorage.getItem("movies");
  let movieArray: Array<SimpleData>;
  if (movieDataString) {
    movieArray = JSON.parse(movieDataString);
  } else {
    movieArray = [];
  }
  return movieArray;
};

const imageBaseURL = "https://image.tmdb.org/t/p/w185";
const WatchList = () => {
  const movieArray = retrieveLocal();
  const [list, setList] = useState<SimpleData[]>(movieArray);
  const navigate = useNavigate();
  const clearLocal = () => {
    localStorage.clear();
    setList([]);
  };
  // save updated list to local storage
  useEffect(() => {
    const jsonString: string = JSON.stringify(list);
    localStorage.setItem("movies", jsonString);
  }, [list]);
  // move to movie detalpage
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const title = target.parentElement?.querySelector("h2")?.innerText;
    const movieId = target.id;
    if (title) {
      navigate(`/movie/detail/${title}?movieId=${movieId}`);
    }
  };
  const watchedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const index = Number(target.id);
    if (index >= 0) {
      setList(
        produce((draft) => {
          draft.splice(index, 1);
        })
      );
    }
  };
  return (
    <div className="watch-div">
      <h1>Watch List</h1>
      {list.length == 0 ? (
        <h1 className="no-movies">No movies here yet..</h1>
      ) : (
        <div className="list-board">
          {list.map((movie, i) => {
            return (
              <div key={i} className="movie-panel">
                <div className="title-container">
                  <h2 className="small-title">{movie.title}</h2>
                </div>
                <div className="image-container">
                  {movie.poster_path ? (
                    <img
                      src={`${imageBaseURL}/${movie.poster_path}`}
                      alt="poster image"
                      className="small-image"
                    ></img>
                  ) : (
                    <div className="mini-no-poster">No Poster</div>
                  )}
                </div>

                <h3 className="sub-title">{movie.release_date}</h3>

                <Button
                  className="list-button"
                  variant="outline-info"
                  onClick={handleClick}
                  id={String(movie.id)}
                >
                  Detail
                </Button>
                <Button
                  className="list-button"
                  variant="outline-warning"
                  id={String(i)}
                  onClick={watchedClick}
                >
                  Watched
                </Button>
              </div>
            );
          })}
        </div>
      )}
      {list.length > 0 && (
        <Button
          className="clear-local"
          onClick={clearLocal}
          variant="outline-danger"
        >
          Clear Local Storage
        </Button>
      )}
    </div>
  );
};

export default WatchList;
