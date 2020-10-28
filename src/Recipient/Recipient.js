import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const Recipient = () => {

    return (
        <div>
        <br></br> 
        <Row className = 'recipientInfo'>   
                <Col>
                    <input type="text" placeholder="Name"  />
                    <input type="email" placeholder="Email" />
                </Col>
        </Row>
        </div>
    )
} 

export default Recipient;