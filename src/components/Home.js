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
        <div className="text-center">
          <img src={process.env.PUBLIC_URL + '/diamond-png-image-pngfre-24.png'} width={'500'} height={'400'} alt="Diamond Logo" />
          <h3 style={{ fontFamily: "Galimer", fontWeight:'bold'}}>
            Diary and Money Discipline
          </h3>
        </div>
        <hr></hr>
        <p></p>
        <div className="text-center" style={{fontFamily:"Galimer"}}>
          {/* <p style={{fontWeight:'bold'}}>Member:</p> */}
          <p>221524018 Muhammad Azharuddin Hamid</p>
          <p>221524019 Muhammad Fikri Nur Sya'Bani</p>
          <p>221524027 Rayhan Fanez Fathiadi</p>
        </div>
      </header>
    </div>
  );
};

export default Home;
