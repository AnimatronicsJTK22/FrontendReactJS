import React, { Component } from "react";
import { connect } from "react-redux";
import {
  retrieveDiary,
  findDiaryByTitle,
  deleteAllDiary,
} from "../slices/diary";
import { Link } from "react-router-dom";

class DiaryList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.setActiveDiary = this.setActiveDiary.bind(this);
    this.findByTitle = this.findByTitle.bind(this);
    this.removeAllDiary = this.removeAllDiary.bind(this);

    this.state = {
      currentDiary: null,
      currentIndex: -1,
      searchTitle: "",
    };
  }

  componentDidMount() {
    this.props.retrieveDiary();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle,
    });
  }

  refreshData() {
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
    this.props
      .deleteAllDiary()
      .then((response) => {
        console.log(response);
        this.refreshData();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  findByTitle() {
    this.refreshData();

    this.props.findDiaryByTitle({ title: this.state.searchTitle });
  }

  render() {
    const { searchTitle, currentDiary, currentIndex } = this.state;
    const { diaries } = this.props;

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
                onClick={this.findByTitle}
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
              <h4>diary</h4>
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
              <p>Please click on a diary...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    diaries: state.diaries,
  };
};

export default connect(mapStateToProps, {
  retrieveDiary,
  findDiaryByTitle,
  deleteAllDiary,
})(DiaryList);
