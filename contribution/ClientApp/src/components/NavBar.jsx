import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class NavBar extends Component {
  render() {
    const { user } = this.props;
    console.log(user);
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {user && (
              <React.Fragment>
                <li className="nav-item active">
                  <NavLink className="nav-link" to="/">
                    Home <span className="sr-only">(current)</span>
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/members">
                    Xubnaha
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/receipts">
                    Lacag qabasho
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/payments">
                    Lacag bixin
                  </NavLink>
                </li>
              </React.Fragment>
            )}
            {user && (
              <React.Fragment>
                <li className="nav-item">
                  <NavLink to="/users" className="nav-link">
                    {user["username"]}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/logout" className="nav-link">
                    Log out
                  </NavLink>
                </li>
              </React.Fragment>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default NavBar;
