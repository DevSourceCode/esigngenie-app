import React from 'react';
import './App.css';
import Login from './Login/Login'
import {Route, BrowserRouter as Router} from 'react-router-dom'
import Document from './Document/Document'

function App() {
  return (
    <Router>
    <switch>
    <Route path='/' exact component={Login}></Route>
    <Route path='/document' component={Document}></Route>
    </switch>
    </Router>
  );
}
export default App;
