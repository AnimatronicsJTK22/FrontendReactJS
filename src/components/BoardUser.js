import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { MdAdd, MdList } from "react-icons/md";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";

const BoardUser = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
        console.log(response.data);
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
    <div className="container">
      <header className="jumbotron">
        <h3>Pilih Menu :</h3>
        <div>
          <Link
            to={"/add"}
            className="badge badge-primary"
            style={{
              fontSize: "18px",
              padding: "12px 24px",
              marginRight: "10px",
            }}
          >
            <MdAdd /> Add
          </Link>
          <Link
            to={"/diary"}
            className="badge badge-primary"
            style={{
              fontSize: "18px",
              padding: "12px 24px",
              marginRight: "10px",
            }}
          >
            <MdList /> List
          </Link>
        </div>
        {/* <div>
          <Link
            to={"/"}
            className="badge badge-danger"
            style={{
              fontSize: "18px",
              padding: "12px 24px",
              marginTop: "10px",
            }}
          >
            Kembali
          </Link>
        </div> */}
      </header>
    </div>
  );
};

export default BoardUser;
