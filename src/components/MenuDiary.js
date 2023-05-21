import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardUser = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
        // console.log(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(_content);

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }, []);

  return (
    <div className="container text-center" style={{display:'flex', justifyContent: "center"}}>
      <header className="jumbotron">
        <h3 style={{ fontFamily: "Gentona" }}>MENU</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link
            to={"/add"}
            className="badge badge-primary navbar-custom"
            style={{
              fontSize: "24px",
              padding: "24px 36px",
              marginRight: "10px",
              height: "350px",
              width: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{fontFamily:"Noctis", fontSize:'18px'}} className="text-center">
              <p>Add your diary</p>
            </div>
            {/* <MdAdd style={{ alignSelf: "center" }} /> */}
          </Link>
          <Link
            to={"/diary"}
            className="badge badge-primary navbar-custom"
            style={{
              fontSize: "24px",
              padding: "24px 36px",
              marginRight: "10px",
              height: "350px",
              width: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{fontFamily:"Noctis", fontSize:'18px'}} className="text-center">
              <p>Look at your <br></br>diaries</p>
            </div>
            {/* <MdList style={{ alignSelf: "center" }} /> */}
          </Link>
        </div>
      </header>
    </div>
  );
};

export default BoardUser;
