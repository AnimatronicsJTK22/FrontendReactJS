import React, { Component } from "react";
import { connect } from "react-redux";
import { createDiary } from "../slices/diary";
import { Link } from "react-router-dom";
import { MdCheck, MdArrowBack } from "react-icons/md";

class AddDiary extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeContent = this.onChangeContent.bind(this);
    this.saveDiary = this.saveDiary.bind(this);
    this.newDiary = this.newDiary.bind(this);

    this.state = {
      id: null,
      title: "",
      content: "",
      visibility: false,
      submitted: false,
    };
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value,
    });
  }

  onChangeContent(e) {
    this.setState({
      content: e.target.value,
    });
  }

  saveDiary() {
    const { title, content } = this.state;

    this.props
      .createDiary({ title, content })
      .unwrap()
      .then((data) => {
        this.setState({
          id: data.id,
          title: data.title,
          content: data.content,
          visibility: data.visibility,
          submitted: true,
        });
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newDiary() {
    this.setState({
      id: null,
      title: "",
      content: "",
      visibility: false,
      submitted: false,
    });
  }

  render() {
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            {/* <button className="btn btn-success" onClick={this.newDiary}>
              Add
            </button> */}
            <Link to={"/diary"} className="btn btn-success" onClick={this.newDiary}>
              Add
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                className="form-control"
                id="content"
                required
                value={this.state.content}
                onChange={this.onChangeContent}
                name="content"
                rows="5"
                cols="50"
              ></textarea>
            </div>

            <button onClick={this.saveDiary} className="btn btn-success mr-2 btn-icon">
              <MdCheck className="icon"/> Submit
            </button>
            <Link to={"/menudiary"} className="btn btn-danger btn-icon">
              <MdArrowBack className="icon" />
              Kembali
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default connect(null, { createDiary })(AddDiary);
