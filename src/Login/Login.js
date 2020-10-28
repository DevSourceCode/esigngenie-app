import React, { Component } from "react";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";

class Login extends Component {
  constructor() {
    super();
    this.Email = "admin@ex.com";
    this.Password = "1234";
    this.EmailTyped = "";
    this.PasswordTyped = "";
  }

  state = {
    isPasswordIncorrect: false,
  };

  validateUser = () => {
    if (
      this.EmailTyped === this.Email &&
      this.Password === this.PasswordTyped
    ) {
      window.location.pathname = "/document";
      localStorage.setItem("loggedIn", true);
    } else {
      localStorage.setItem("loggedIn", false);
      this.setState({isPasswordIncorrect : true})
    }
  };

  setEmailTyped = (event) => {
    this.EmailTyped = event.target.value;
  };

  setPasswordTyped = (event) => {
    this.PasswordTyped = event.target.value;
  };

  render() {
    return (
      <Container>
          {this.state.isPasswordIncorrect ? 
            <Alert variant="danger">Email or Password is incorrect</Alert>
           : null}
        <Card style={{ width: "30rem" }}>
          <Card.Header className="white-text text-center py-4">
            <strong>Sign in</strong>
          </Card.Header>
          <Card.Body>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={this.setEmailTyped}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={this.setPasswordTyped}
                />
              </Form.Group>

              <Button variant="primary" onClick={this.validateUser}>
                Login
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default Login;
