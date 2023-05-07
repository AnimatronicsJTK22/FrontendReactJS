import React, { Component } from "react";
import DiaryDataService from "../services/diary.service";
import { withRouter } from "../common/with-router";

class Diary extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
    this.getDiary = this.getDiary.bind(this);
    this.updateVisibility = this.updateVisibility.bind(this);
    this.updateDiary = this.updateDiary.bind(this);
    this.deleteDiary = this.deleteDiary.bind(this);

    this.state = {
      currentDiary: {
        id: null,
        title: "",
        content: "",
        visibility: false,
      },
      message: "",
    };
  }

  componentDidMount() {
    this.getDiary(this.props.router.params.id);
  }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        currentDiary: {
          ...prevState.currentDiary,
          title: title,
        },
      };
    });
  }

  onChangeContent(e) {
    const content = e.target.value;

    this.setState((prevState) => ({
      currentDiary: {
        ...prevState.currentDiary,
        content: content,
      },
    }));
  }

  getDiary(id) {
    DiaryDataService.get(id)
      .then((response) => {
        this.setState({
          currentDiary: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateVisibility(status) {
    var data = {
      id: this.state.currentDiary.id,
      title: this.state.currentDiary.title,
      content: this.state.currentDiary.content,
      visibility: status,
    };

    DiaryDataService.update(this.state.currentDiary.id, data)
      .then((response) => {
        this.setState((prevState) => ({
          currentDiary: {
            ...prevState.currentDiary,
            visibility: status,
          },
        }));
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateDiary() {
    DiaryDataService.update(this.state.currentDiary.id, this.state.currentDiary)
      .then((response) => {
        console.log(response.data);
        this.setState({
          message: "The diary was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteDiary() {
    if (window.confirm("Are you sure to delete this diary?")) {
      DiaryDataService.delete(this.state.currentDiary.id)
        .then((response) => {
          console.log(response.data);
          this.props.router.navigate("/diary");
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  render() {
    const { currentDiary } = this.state;

    return (
      <div>
        {currentDiary ? (
          <div className="edit-form">
            <h4>Diary</h4>
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={currentDiary.title}
                  onChange={this.onChangeTitle}
                />
              </div>
              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  className="form-control"
                  id="content"
                  value={currentDiary.content}
                  onChange={this.onChangeContent}
                  name="content"
                  rows="5"
                  cols="50"
                ></textarea>
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentDiary.visibility ? "Public" : "Private"}
              </div>
            </form>

            {currentDiary.visibility ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateVisibility(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateVisibility(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteDiary}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateDiary}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Diary...</p>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(Diary);
