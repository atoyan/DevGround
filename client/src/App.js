import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router , Route} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from './actions/authActions';
import {Provider} from "react-redux";
import store    from "./store";

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';



//Check for Token
if(localStorage.jwtToken){
  //Set auth token header off
    setAuthToken(localStorage.jwt_decode);
  //Decode Token and get user info and expiration
    const decoded  =  jwt_decode(localStorage.jwtToken);
  //Set User and isAuthenticated
   store.dispatch(setCurrentUser(decoded));
}


class App extends Component {

  render() {
    return (
      <Provider store = {store}>
      <Router>
      <div className="App">
        <Navbar/> 

       <Route exact path="/" component = {Landing} />
       <div className="container">
         <Route exact path = "/register" component = {Register}/>
         <Route exact path = "/login" component = {Login}/> 
       </div>
      
      <Footer />
      </div>
      </Router>
      </Provider>
    );
  }
} 

export default App;
