import React, { Component } from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
class Login extends Component {


    authenticate = () => {
        
    } 

    render(){
   return  (
    <Container>
        <Card style={{width: '30rem'}}>
    <Card.Header className='white-text text-center py-4'>
        <strong>Sign in</strong>
    </Card.Header>
    <Card.Body>
    <Form>
    <Form.Group controlId="formBasicEmail">
      <Form.Label>Email address</Form.Label>
      <Form.Control type="email" placeholder="Enter email" />
    </Form.Group>
  
    <Form.Group controlId="formBasicPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control type="password" placeholder="Password" />
    </Form.Group>

    <Button variant="primary">
      Login
    </Button>
  </Form>
  </Card.Body>
  </Card>
  </Container>
   )
    } 
}

export default Login;