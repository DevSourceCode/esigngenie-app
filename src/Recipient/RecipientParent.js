import React from 'react';
import { Button } from 'react-bootstrap';

const RecipientParent = props => (
    <div >
      <Button onClick={props.addChild}>Add Recipient</Button>
      <div>
        {props.children}
      </div>
    </div>
  );

  export default RecipientParent;