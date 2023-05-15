import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import { ListGroup, Button, Row, Col } from "react-bootstrap";
import Swal from "react-bootstrap-sweetalert";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = () => {
    authService.getAllUsers()
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteUser = (id, username) => {
    if (username === "admin") {
      setShowPopup(true);
      return;
    }

    authService
      .deleteUserById(id)
      .then(() => {
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <h3>User List</h3>
      <ListGroup>
        {users.map((user) => (
          <ListGroup.Item key={user.id}>
            <Row>
              <Col>{user.username}</Col>
              <Col xs="auto">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteUser(user.id, user.username)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Swal
        show={showPopup}
        title="Access Denied"
        text="You cannot delete the admin user."
        type="error"
        onConfirm={closePopup}
      />
    </div>
  );
};


export default UserList;
