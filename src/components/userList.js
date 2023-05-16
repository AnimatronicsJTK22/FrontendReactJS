import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import { ListGroup, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert";
// import 'sweetalert/dist/sweetalert.css';

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
    Swal({
      title: "Confirmation",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((confirmed) => {
      if (confirmed) {
        authService
          .deleteUserById(id)
          .then((response) => {
            if (response.status == 403) {
              setShowPopup(true);
            } else {
              getAllUsers();
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
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

      {showPopup && (
        <Swal
          show={showPopup}
          title="Access Denied"
          text="You cannot delete the admin user."
          icon="error"
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default UserList;
