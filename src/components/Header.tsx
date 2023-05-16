import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

const Header = () => {
  return (
    <Navbar bg="light" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand>
          <span className="blue">F</span>
          <span className="red">I</span>
          <span className="yellow">N</span>
          <span className="green">D</span>
          &nbsp;
          <span className="orange">I</span>
          <span className="red">T</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/">Director</Link>
            <Link to="/movie">Movie</Link>
            <Link to="/star">Actor</Link>
            <Link to="/watchlist">Watch List</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Header;
