import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import MenuDiary from "./components/MenuDiary";
import MenuMoney from "./components/MenuMoney";
import UserList from "./components/userList";
import BoardAdmin from "./components/BoardAdmin";

import { logout } from "./slices/auth";

import EventBus from "./common/EventBus";
import DiaryListComponent from "./components/diary-list.component";
import AddDiaryComponent from "./components/add-diary.component";
import Diary from "./components/diary.component";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    } else {
      setShowModeratorBoard(false);
      setShowAdminBoard(false);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand navbar-dark navbar-custom">
          <Link to={"/"} className="navbar-brand" style={{ fontFamily: 'Gentona', fontSize: '32px', fontWeight: 'bold' }}>
            Diamond
          </Link>
          <div className="navbar-nav mr-auto" style={{fontWeight:'bold'}}>
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/userList"} className="nav-link">
                  Users
                </Link>
              </li>
            )}

            {showAdminBoard && (
              <li className="nav-item">
                <Link to={"/admin"} className="nav-link">
                  Diaries
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={"/menudiary"} className="nav-link">
                  Diary
                </Link>
              </li>
            )}

            {currentUser && (
              <li className="nav-item">
                <Link to={`/menumoney/${currentUser?.id ?? ''}`} className="nav-link">
                  Money
                </Link>
              </li>
            )}
          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto" style={{fontWeight:'bold'}}>
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                {currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1)}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto" style={{fontWeight:'bold'}}>
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/menudiary" element={<MenuDiary />} />
            <Route path="/menumoney/:id" element={<MenuMoney />} />
            <Route path="/userList" element={<UserList />} />
            <Route path="/admin" element={<BoardAdmin />} />
            <Route path="/diary" element={<DiaryListComponent/>} />
            <Route path="/diary/:id" element={<Diary/>} />
            <Route path="/add" element={<AddDiaryComponent/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
