import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PAGE_URL } from "../constant";
import axios from "axios";
import "./moviedetail.css";
import data from "../data/genre_ids.json";
import Button from "react-bootstrap/Button";

interface GenreIds {
  [id: number]: string;
}
const genreIds: GenreIds = data;

const imageBaseURL = "https://image.tmdb.org/t/p/w342";

interface MovieData {
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

const MovieDetail: React.FC = () => {
  const { title } = useParams();
  const [data, setData] = useState<MovieData | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [directors, setDirectors] = useState<string[]>([]);
  const [casts, setCasts] = useState<Cast[]>([]);
  useEffect(() => {
    const URL = process.env.REACT_APP_THIRD_API_URL;
    const ApiKey = process.env.REACT_APP_THIRD_API_KEY;
    let urlTitle = "";
    if (typeof title !== "undefined") {
      urlTitle = title.replace("%20", "+");
    }
    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `${URL}/search/movie?api_key=${ApiKey}&query=${urlTitle}`
        );
        const id = response.data.results[0]["id"];
        console.log(id);
        setData(response.data.results[0]);
        setLoading(false);
        try {
          const response2 = await axios.get(
            `${URL}/movie/${id}/credits?api_key=${ApiKey}`
          );
          const credits = response2.data;
          console.log(credits);
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
      } catch (error) {
        console.error("Error fetching movie:", error);
      }
    };
    fetchMovie();
  }, []);
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
  if (loading) {
    return (
      <div className="movie-detail">
        <h1>Loading....</h1>
      </div>
    );
  }
  return (
    <div className="movie-detail">
      {data ? (
        <>
          <h1 className="movie-title">{data.title}</h1>
          <h2 className="sub-title">Release Date: {data.release_date}</h2>
          {data.poster_path ? (
            <img
              src={`${imageBaseURL}/${data.poster_path}`}
              alt="movie poster"
            />
          ) : (
            <div className="no-poster">No Poster</div>
          )}
          <div className="genres">
            Genre:
            {data.genre_ids &&
              data.genre_ids.map((genre, i) => {
                return <div key={i}>{genreIds[genre]}</div>;
              })}
          </div>
          <div className="overview">
            <p>{data.overview}</p>
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
          <Button className="add-watch" variant="outline-info">
            Watch List +
          </Button>{" "}
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
