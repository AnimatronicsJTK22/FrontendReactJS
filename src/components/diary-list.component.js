import React, { Component } from "react";
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
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieveDiaries();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveDiaries() {
    DiaryDataService.getAll()
      .then(response => {
        this.setState({
          diaries: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveDiaries();
    this.setState({
      currentDiary: null,
      currentIndex: -1
    });
  }

  setActiveDiary(diary, index) {
    this.setState({
      currentDiary: diary,
      currentIndex: index
    });
  }

  removeAllDiary() {
    DiaryDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    this.setState({
      currentDiary: null,
      currentIndex: -1
    });

    DiaryDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          diaries: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { searchTitle, diaries, currentDiary, currentIndex } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
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
              diaries.map((diary, index) => (
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

          <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.removeAllDiary}
          >
            Remove All
          </button>
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
                {currentDiary.owner}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentDiary.visibility ? "Visible" : "Pending"}
              </div>

              <Link
                to={"/diaries/" + currentDiary.id}
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
