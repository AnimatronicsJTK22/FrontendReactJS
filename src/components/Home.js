import React, { useState, useEffect } from "react";

import UserService from "../services/user.service";

const Home = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const _content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

        setContent(_content);
      }
    );
  }, []);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Diary and Money Discipline Web Application</h3>
        <hr></hr>
        <p></p>
        <p>1. 221524018 Muhammad Azharuddin Hamid</p>
        <p>2. 221524019 Muhammad Fikri Nur Sya'Bani</p>
        <p>3. 221524027 Rayhan Fanez Fathiadi</p>
      </header>
    </div>
  );
};

export default Home;
