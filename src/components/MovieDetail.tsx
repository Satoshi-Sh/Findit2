import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  poster_path: string;
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

const MovieDetail: React.FC = () => {
  const { title } = useParams();
  const [data, setData] = useState<MovieData | null>();
  const [loading, setLoading] = useState<boolean>(true);
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
          `${URL}/search/movie?api_key=${ApiKey}&query=${urlTitle}&append_to_response=credits`
        );
        console.log(response.data.results[0]);
        console.log(response.data.credits);
        setData(response.data.results[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchMovie();
  }, []);
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
          <img src={`${imageBaseURL}/${data.poster_path}`} alt="movie poster" />
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
          <Button className="add-watch" variant="outline-info">
            Watch List +
          </Button>{" "}
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
