import React, { Component } from "react";
import { connect } from "react-redux";
import { updateDiary, deleteDiary } from "../slices/diary";
import DiaryDataService from "../services/diary.service";
import { withRouter } from '../common/with-router';

class Diary extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getDiary = this.getDiary.bind(this);
    this.updateStatus = this.updateStatus.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.removeDiary = this.removeDiary.bind(this);

    this.state = {
      currentDiary: {
        id: null,
        title: "",
        description: "",
        published: false,
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

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState((prevState) => ({
      currentDiary: {
        ...prevState.currentDiary,
        description: description,
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

  updateStatus(status) {
    var data = {
      id: this.state.currentDiary.id,
      title: this.state.currentDiary.title,
      description: this.state.currentDiary.description,
      published: status,
    };

    this.props
      .updateDiary({ id: this.state.currentDiary.id, data })
      .unwrap()
      .then((reponse) => {
        console.log(reponse);

        this.setState((prevState) => ({
          currentDiary: {
            ...prevState.currentDiary,
            published: status,
          },
        }));

        this.setState({ message: "The status was updated successfully!" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateContent() {
    this.props
      .updateDiary({ id: this.state.currentDiary.id, data: this.state.currentDiary })
      .unwrap()
      .then((reponse) => {
        console.log(reponse);
        
        this.setState({ message: "The diary was updated successfully!" });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  removeDiary() {
    this.props
      .deleteDiary({ id: this.state.currentDiary.id })
      .then(() => {
        this.props.router.navigate('/diaries');
      })
      .catch((e) => {
        console.log(e);
      });
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
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  value={currentDiary.description}
                  onChange={this.onChangeDescription}
                />
              </div>

              <div className="form-group">
                <label>
                  <strong>Status:</strong>
                </label>
                {currentDiary.published ? "Published" : "Pending"}
              </div>
            </form>

            {currentDiary.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateStatus(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updateStatus(true)}
              >
                Publish
              </button>
            )}

            <button
              className="badge badge-danger mr-2"
              onClick={this.removeDiary}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateContent}
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

export default connect(null, { updateDiary, deleteDiary })(withRouter(Diary));
