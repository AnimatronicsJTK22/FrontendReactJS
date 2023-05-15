import React, { Component } from "react";
import { FaTrashAlt } from 'react-icons/fa';
import { BsArrowLeft } from 'react-icons/bs';
import DiaryDataService from "../services/diary.service";
import { Link } from "react-router-dom";

export default class DiariesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveDiaries = this.retrieveDiaries.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveDiary = this.setActiveDiary.bind(this);
    this.removeAllDiary = this.removeAllDiary.bind(this);
    this.searchTitle = this.searchTitle.bind(this);

    this.state = {
      diaries: [],
      currentDiary: null,
      currentIndex: -1,
      searchTitle: "",
    };
  }

  componentDidMount() {
    this.retrieveDiaries();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  retrieveDiaries() {
    DiaryDataService.getAll()
      .then((response) => {
        this.setState({
          diaries: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveDiaries();
    this.setState({
      currentDiary: null,
      currentIndex: -1,
    });
  }

  setActiveDiary(diary, index) {
    this.setState({
      currentDiary: diary,
      currentIndex: index,
    });
  }

  removeAllDiary() {
    if (
      window.confirm(
        "Are you sure you want to delete all diaries? (admin only)"
      )
    ) {
      DiaryDataService.deleteAll()
        .then((response) => {
          console.log(response.data);
          this.refreshList();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  searchTitle() {
    this.setState({
      currentDiary: null,
      currentIndex: -1,
    });

    DiaryDataService.findByTitle(this.state.searchTitle)
      .then((response) => {
        this.setState({
          diaries: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { diaries, currentDiary, currentIndex } = this.state;
  
    return (
      <div className="list row">
        <div className="col-md-6">
          <h4 className="text-center">Diary List</h4>
  
          {diaries.length ? (
            <ul className="list-group">
              {diaries.map((diary, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveDiary(diary, index)}
                  key={index}
                >
                  {diary.title}
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info" role="alert">
              Diary kosong..
            </div>
          )}
  
          <button
            className="m-3 btn btn-sm btn-warning btn-icon"
            onClick={this.removeAllDiary}
          >
            <FaTrashAlt className="icon" />
            Remove All
          </button>
          <Link to={"/"} className="btn btn-sm btn-danger btn-icon">
          <BsArrowLeft className="icon" />
            Kembali
          </Link>
        </div>
        <div className="col-md-6">
          {currentDiary ? (
            <div>
              <h4>Diary</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentDiary.title}
              </div>
              <div>
                <label>
                  <strong>Content:</strong>
                </label>{" "}
                {currentDiary.content}
              </div>
              <div>
                <label>
                  <strong>Owner:</strong>
                </label>{" "}
                {currentDiary.owner.charAt(0).toUpperCase() +
                  currentDiary.owner.slice(1)}
              </div>
              <div>
                <label>
                  <strong>Time:</strong>
                </label>{" "}
                {new Date(currentDiary.time).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                })}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentDiary.visibility ? "Public" : "Private"}
              </div>
  
              <Link
                to={"/diary/" + currentDiary.id}
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
  }
}  
