import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  retrieveDiaries,
  findDiariesByTitle,
  deleteAllDiaries,
} from "../slices/diary";
import { Link } from "react-router-dom";

const DiariesList = () => {
  const [currentDiaries, setCurrentDiaries] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchTitle, setSearchTitle] = useState("");

  const diaries = useSelector(state => state.diaries);
  const dispatch = useDispatch();

  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const initFetch = useCallback(() => {
    dispatch(retrieveDiaries());
  }, [dispatch])

  useEffect(() => {
    initFetch()
  }, [initFetch])

  const refreshData = () => {
    setCurrentDiaries(null);
    setCurrentIndex(-1);
  };

  const setActiveDiaries = (tutorial, index) => {
    setCurrentDiaries(tutorial);
    setCurrentIndex(index);
  };

  const removeAllDiaries = () => {
    dispatch(deleteAllDiaries())
      .then(response => {
        refreshData();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByTitle = () => {
    refreshData();
    dispatch(findDiariesByTitle({ title: searchTitle }));
  };

  return (
    <div className="list row">
      <div className="col-md-8">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
            value={searchTitle}
            onChange={onChangeSearchTitle}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByTitle}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Diary List</h4>

        <ul className="list-group">
          {diaries &&
            diaries.map((diaries, index) => (
              <li
                className={
                  "list-group-item " + (index === currentIndex ? "active" : "")
                }
                onClick={() => setActiveDiaries(diaries, index)}
                key={index}
              >
                {diaries.title}
              </li>
            ))}
        </ul>

        <button
          className="m-3 btn btn-sm btn-danger"
          onClick={removeAllDiaries}
        >
          Remove All
        </button>
      </div>
      <div className="col-md-6">
        {currentDiaries ? (
          <div>
            <h4>Diary</h4>
            <div>
              <label>
                <strong>Title:</strong>
              </label>{" "}
              {currentDiaries.title}
            </div>
            <div>
              <label>
                <strong>Content:</strong>
              </label>{" "}
              {currentDiaries.content}
            </div>
            <div>
              <label>
                <strong>Status:</strong>
              </label>{" "}
              {currentDiaries.visibility ? "Published" : "Pending"}
            </div>

            <Link
              to={"/tutorials/" + currentDiaries.id}
              className="badge badge-warning"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Diary...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiariesList;
