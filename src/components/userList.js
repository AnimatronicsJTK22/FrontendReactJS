import React, { useEffect, useState } from "react";
import authService from "../services/auth.service";
import { ListGroup, Button, Row, Col } from "react-bootstrap";

const UserList = () => {
  const [users, setUsers] = useState([]);

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

  const deleteUser = (id) => {
    authService.deleteUserById(id)
      .then(() => {
        getAllUsers();
      })
      .catch((error) => {
        console.log(error);
      });
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
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};


export default UserList;
