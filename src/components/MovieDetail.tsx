import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./moviedetail.css";

const MovieDetail = () => {
  const { title } = useParams();
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
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchMovie();
  });
  return <h1>{title}</h1>;
};

export default MovieDetail;
