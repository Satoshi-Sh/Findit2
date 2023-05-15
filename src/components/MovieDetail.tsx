import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./moviedetail.css";

const MovieDetail = () => {
  const { title } = useParams();
  return <h1>{title}</h1>;
};

export default MovieDetail;
