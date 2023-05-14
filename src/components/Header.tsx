import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="header">
      <h1 className="logo">
        <span className="blue">F</span>
        <span className="red">I</span>
        <span className="yellow">N</span>
        <span className="green">D</span>
        &nbsp;
        <span className="orange">I</span>
        <span className="red">T</span>
      </h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Director</Link>
          </li>
          <li>
            <Link to="/movie">Movie</Link>
          </li>
          <li>
            <Link to="/star">Star</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Header;
