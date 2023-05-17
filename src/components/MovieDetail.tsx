import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { PAGE_URL } from "../constant";
import axios from "axios";
import "./moviedetail.css";
import data from "../data/genre_ids.json";
import Button from "react-bootstrap/Button";
import { retrieveLocal } from "./WatchList";
import { produce } from "immer";

interface GenreIds {
  [id: number]: string;
}
const genreIds: GenreIds = data;

const imageBaseURL = "https://image.tmdb.org/t/p/w342";

export interface MovieData {
  poster_path: string | null;
  adult: boolean;
  overview: string;
  release_date: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface SimpleData {
  id: number;
  poster_path: string | null;
  title: string;
  release_date: string;
}

interface Crew {
  adult: boolean;
  credit_id: string;
  department: string;
  gender: number;
  id: number;
  job: string;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}
interface Cast {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}
// button div for index
interface ButtonsProps {
  dataLength: number;
  mIndex: number;
  setmIndex: React.Dispatch<React.SetStateAction<number>>;
}
const IndexButtons: React.FC<ButtonsProps> = ({
  dataLength,
  mIndex,
  setmIndex,
}) => {
  const increaseIndex = () => {
    setmIndex((prev) => prev + 1);
  };
  const decreaseIndex = () => {
    setmIndex((prev) => prev - 1);
  };
  const canDecrease = mIndex >= 1;
  const canIncrease = mIndex < dataLength - 1;
  if (dataLength == 1) {
    return <></>;
  }
  return (
    <div className="buttons-div">
      <Button
        disabled={!canDecrease}
        onClick={decreaseIndex}
        variant="secondary"
      >
        &lt;
      </Button>
      <Button
        disabled={!canIncrease}
        onClick={increaseIndex}
        variant="secondary"
      >
        &gt;
      </Button>
    </div>
  );
};

const MovieDetail: React.FC = () => {
  const { title } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get("movieId");
  const [data, setData] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [directors, setDirectors] = useState<string[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  const movieArray: Array<SimpleData> = retrieveLocal();
  const [list, setList] = useState<SimpleData[]>(movieArray);

  const [added, setAdded] = useState<boolean>(false);
  const [mIndex, setmIndex] = useState<number>(0);
  const URL = process.env.REACT_APP_THIRD_API_URL;
  const ApiKey = process.env.REACT_APP_THIRD_API_KEY;
  const d = data[mIndex];
  useEffect(() => {
    let urlTitle = "";
    if (typeof title !== "undefined") {
      urlTitle = title.replace("%20", "+");
    }
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${URL}/find/tt${movieId}?api_key=${ApiKey}&external_source=imdb_id`
        );
        let id;

        if (response.data.movie_results.length == 0) {
          const responseSecond = await axios.get(
            `${URL}/search/movie?api_key=${ApiKey}&query=${urlTitle}`
          );
          setData(responseSecond.data.results);
        } else {
          id = response.data.movie_results["id"];
          setData(response.data.movie_results);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    fetchMovie();
    setLoading(false);
  }, []);

  // fetch credits when index is changed
  useEffect(() => {
    const fetchCredit = async () => {
      try {
        if (!data[mIndex]) return;
        const id = data[mIndex].id;
        const response2 = await axios.get(
          `${URL}/movie/${id}/credits?api_key=${ApiKey}`
        );
        const credits = response2.data;
        // crew
        const crews: Crew[] = credits.crew;
        const directorArray = crews
          .filter((obj) => obj.job.toLowerCase() === "director")
          .map((obj) => obj.name);
        setDirectors(directorArray);
        // cast
        setCasts(credits.cast);
      } catch (error) {
        console.error("Erro fetching credits:", error);
      }
    };
    fetchCredit();
  }, [mIndex, data]);
  // check if the movie is in the watchlist
  useEffect(() => {
    if (!d) return;
    const hasMovie = list.some((movie) => movie.title == data[mIndex].title);
    setAdded(hasMovie);
  }, [mIndex, data, list]);
  // save update data to local storage
  useEffect(() => {
    const jsonString: string = JSON.stringify(list);
    localStorage.setItem("movies", jsonString);
  }, [added]);
  // move to director detailpage
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const name = target.innerText;
    window.location.href = `${PAGE_URL}/detail/${name}`;
  };
  // move to actor detailpage
  const handleClick2 = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const name = target.innerText;
    window.location.href = `${PAGE_URL}/star/detail/${name}`;
  };
  const addList = () => {
    if (data[mIndex]) {
      const d = data[mIndex];
      setList(
        produce((draft) => {
          draft.push({
            id: d.id,
            poster_path: d.poster_path,
            title: d.title,
            release_date: d.release_date,
          });
        })
      );

      setAdded(true);
    }
  };
  const removeList = () => {
    const index: number = list.findIndex((movie) => movie.title === title);
    setList(
      produce((draft) => {
        draft.splice(index, 1);
      })
    );
    setAdded(false);
  };
  if (loading) {
    return (
      <div className="movie-detail">
        <h1>Loading....</h1>
      </div>
    );
  } else if (data.length === 0) {
    <div className="movie-detail">
      <h1>No data available</h1>
    </div>;
  }

  return (
    <div className="movie-detail">
      {d ? (
        <>
          <h1 className="movie-title">{d.title}</h1>
          <h2 className="sub-title">Release Date: {d.release_date}</h2>
          {d.poster_path ? (
            <img src={`${imageBaseURL}/${d.poster_path}`} alt="movie poster" />
          ) : (
            <div className="no-poster">No Poster</div>
          )}
          <div className="genres">
            Genre:
            {d.genre_ids &&
              d.genre_ids.map((genre, i) => {
                return <div key={i}>{genreIds[genre]}</div>;
              })}
          </div>
          <IndexButtons
            dataLength={data.length}
            mIndex={mIndex}
            setmIndex={setmIndex}
          />

          <div className="overview">
            <p>{d.overview}</p>
          </div>
          {directors && <h3>Director</h3>}
          <div className="director-div">
            {directors &&
              directors.map((name, i) => {
                return (
                  <div className="director-name" onClick={handleClick} key={i}>
                    {name}
                  </div>
                );
              })}
          </div>
          {added ? (
            <Button
              className="add-watch"
              variant="outline-danger"
              onClick={removeList}
            >
              Watch List -
            </Button>
          ) : (
            <Button
              className="add-watch"
              variant="outline-info"
              onClick={addList}
            >
              Watch List +
            </Button>
          )}

          {casts && <h3>Casts</h3>}
          <ul className="cast-ul">
            {casts &&
              casts.map((cast, i) => {
                return (
                  <li className="cast-name" key={i}>
                    <span className="person-name" onClick={handleClick2}>
                      {cast.name}
                    </span>{" "}
                    ({cast.character})
                  </li>
                );
              })}
          </ul>
          <footer>
            Data Provided by{" "}
            <a className="tmdb-link" href="https://www.themoviedb.org/">
              TMDB
            </a>
          </footer>
        </>
      ) : (
        <h1>No data available..</h1>
      )}
    </div>
  );
};

export default MovieDetail;
