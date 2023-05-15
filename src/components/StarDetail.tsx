import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./detail.css";
import axios from "axios";
import { BASE_URL } from "../constant";
import data from "../year_average.json";

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

const StarDetail = () => {
  const { name } = useParams();
  const [data, setData] = useState<Movie[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/actor/${name}`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="detail-div">
      <h1>{name}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-div">
          {/* Display the fetched data  - title,rating,vote, year */}
          {data && (
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
                {data.map((movie, i) => {
                  return (
                    <tr key={i} className={i % 2 === 0 ? "even" : "odd"}>
                      <td className="td-title">{movie.title}</td>
                      <td className="td-rating">
                        {movie.rating} ({yearAverage[movie.year].toFixed(2)})
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

export default StarDetail;
