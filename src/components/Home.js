import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
  }, [setContent]);

  const memberData = [
    {
      name: "Muhammad Azharuddin",
      photo: process.env.PUBLIC_URL + "/azhar.jpg",
    },
    {
      name: "Muhammad Fikri Nur Sya'Bani",
      photo: process.env.PUBLIC_URL + "/fikri24013.JPG",
    },
    {
      name: "Rayhan Fanez Fathiadi",
      photo: process.env.PUBLIC_URL + "/fanez.jpg",
    },
  ];

  return (
    <div className="container">
      <header className="jumbotron">
        <motion.div
          animate={{ scale: 1 }}
          initial={{ scale: 0 }}
          className="text-center"
        >
          <img
            src={process.env.PUBLIC_URL + "/diamond-png-image-pngfre-24.png"}
            width={"500"}
            height={"400"}
            alt="Diamond Logo"
          />
        </motion.div>

        <h3 style={{ fontFamily: "Galimer", fontWeight: "bold" }} className="text-center">
          Diary and Money Discipline
        </h3>

        <hr></hr>
        <p></p>
        <div className="text-center" style={{ fontFamily: "Galimer", display: "flex", justifyContent: "space-around" }}>
          {memberData.map((member, index) => (
            <div key={index}>
              <img
                src={member.photo}
                alt={member.name}
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
              />
              <p>{member.name}</p>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default Home;
