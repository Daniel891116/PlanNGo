import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import './assets/css/home.css';
import Header from './containers/Header'
import Main from './containers/Main'
import Home from './components/Home'
import Login from './containers/Login'
import NewProject from './containers/NewProject'
import { Redirect } from 'react-router-dom';
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: undefined
    }
  }
  componentWillMount(){
    if (sessionStorage.getItem("userID") !== null) {
      this.setState({
        user: sessionStorage.getItem("userID")
      })
      console.log("sess",sessionStorage.getItem("userID"))
    }
  }

  setUser = (userID) => {
    sessionStorage.setItem("userID",userID)
    this.setState({
      user: userID
    })
  }
  
  render() {

    const mainPage = () => {
      console.log("TO main",this.state.user)
      return(
        <div className="grid-container">
          <Header user = {this.state.user}/>
          <Main user = {this.state.user}/>
        </div>
      )
    }

    return (
      <div>
        <Route exact path="/"      component={Home}/>
        <Route path="/Login"  render={(props) => <Login setUser = {this.setUser}/>} />
        <Route path="/NewProject" component={NewProject} />
        <Route path="/main" component={mainPage}/>
      </div>
    );
  }
}

export default App;
