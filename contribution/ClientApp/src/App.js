import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Members from "./components/Members";
import MemberForm from "./components/MemberForm";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Receipts from "./components/Receipts";
import RecieptForm from "./components/RecieptsForm";
import Payments from "./components/Payments";
import PaymentForm from "./components/PaymentForm";
import Users from "./components/Users";
import UserForm from "./components/UserRegistration";
import Login from "./components/Login";
import jwtDecode from "jwt-decode";
import Logout from "./components/Logout";

class App extends Component {
  state = {
    pageSize: 6,
  };

  render() {
    const { pageSize, user } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={user} />
        <main className="container">
          {user && (
            <Switch>
              <Route path="/logout" component={Logout} />
              <Route path="/paymentForm/:id" component={PaymentForm} />
              <Route path="/recieptForm/:id" component={RecieptForm} />
              <Route path="/membersForm/:id" component={MemberForm} />
              <Route path="/not-found" component={NotFound} />
              <Route path="/userForm/:id" component={UserForm} />
              <Route
                path="/users"
                render={(props) => (
                  <Users pageSize={pageSize} {...props} user={user} />
                )}
              />
              <Route
                path="/members"
                render={(props) => <Members {...props} pageSize={pageSize} />}
              />
              <Route
                path="/payments"
                render={(props) => <Payments pageSize={pageSize} {...props} />}
              />
              <Route
                path="/receipts"
                render={(props) => <Receipts {...props} pageSize={pageSize} />}
              />
              <Route path="/" exact component={Home} />
              {user && <Redirect from="/login" to="/" />}
              <Redirect to="/not-found" />
            </Switch>
          )}
          <Route path="/login" component={Login} />
          <Redirect to="/login" />
        </main>
      </React.Fragment>
    );
  }
  async componentDidMount() {
    try {
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);

      this.setState({ user });
    } catch (error) {}
  }
}

export default App;
