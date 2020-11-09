import React, { Component } from "react";
import config from "../config/config.json";
import http from "../httpServices/services";
import Fontawesome from "react-fontawesome";
import Pagination from "./Pagination";
import Paginate from "../utility/pagination";
import { toast } from "react-toastify";

class Users extends Component {
  state = {
    users: [],
    currentPage: 1,
  };

  render() {
    const { users: sysUsers, currentPage } = this.state;
    const { pageSize, user } = this.props;
    const allUsers = sysUsers.filter((u) => u.username !== user.username);
    const users = Paginate(allUsers, pageSize, currentPage);

    return (
      <React.Fragment>
        <div className="row my-3">
          <div className="col-10">
            <p>{allUsers.length} user ayaa diiwan gashan</p>
          </div>
          <div className="col">
            <button
              onClick={this.handleUserForm}
              className="btn btn-primary  float-right"
            >
              <Fontawesome className="fas fa-plus" name="plus" />
              User cusub
            </button>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Username ka</th>
              <th>password ka</th>
              <th></th>
            </tr>
          </thead>
          {allUsers.length !== 0 ? (
            <tbody>
              {users.map((u) => (
                <tr>
                  <td>{u.username}</td>
                  <td>{u.password}</td>
                  <td>
                    <button
                      onClick={() => this.handleDelete(u.id)}
                      className="btn btn-danger"
                    >
                      <Fontawesome
                        className="fas fa-trash"
                        name="trash"
                        style={{ fontSize: 20 }}
                      />
                    </button>
                    <button
                      onClick={() => this.handleUpdate(u.id)}
                      className="btn btn-primary ml-2"
                    >
                      <Fontawesome
                        className="fas fa-pencil"
                        name="pencil"
                        style={{ fontSize: 20 }}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <p className="text-center mt-4">User majirro aan adi ahayn</p>
          )}
        </table>
        <Pagination
          pageSize={pageSize}
          count={allUsers.length}
          currentPage={currentPage}
          onPagination={this.hadlePagination}
        />
      </React.Fragment>
    );
  }
  handleDelete = async (id) => {
    const users = [...this.state.users];
    const filterUsers = [...users.filter((u) => u.id !== id)];
    this.setState({ users: filterUsers });

    try {
      await http.delete(config.usersEndPoint + "/" + id);
      toast.success("waa la tuuray");
    } catch (error) {
      this.setState({ users });
      toast.error("Qallad ayaa dhacay.");
    }
  };
  handleUpdate = (id) => {
    this.props.history.push("/userForm/" + id);
  };
  handleUserForm = () => {
    this.props.history.push("/userForm/new");
  };
  hadlePagination = (currentPage) => {
    this.setState({ currentPage });
  };
  async componentDidMount() {
    const { data: users } = await http.get(config.usersEndPoint);

    this.setState({ users });
  }
}

export default Users;
