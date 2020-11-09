import React, { Component } from "react";
import joi from "joi-browser";
import config from "../config/config.json";
import http from "../httpServices/services";
import { toast } from "react-toastify";

class UserRegistration extends Component {
  state = { user: { id: 0, username: "", password: "" }, errors: {} };
  schema = {
    id: joi.number().allow(0),
    username: joi.string().min(3).label("magaca"),
    password: joi.string().min(5).label("Passward ka"),
  };

  render() {
    const { user, errors } = this.state;
    return (
      <React.Fragment>
        <h3>Diiwanka userada</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Magaca</label>
            <input
              value={user.username}
              onChange={this.handleChange}
              type="text"
              name="username"
              id="username"
              className="form-control"
            />
            {errors["username"] && (
              <div className="alert alert-danger">{errors["username"]}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              value={user.password}
              onChange={this.handleChange}
              name="password"
              id="password"
              type="text"
              className="form-control"
            />
            {errors["password"] && (
              <div className="alert alert-danger">{errors["password"]}</div>
            )}
          </div>
          <button disabled={this.validate()} className="btn btn-primary">
            Save
          </button>
        </form>
      </React.Fragment>
    );
  }
  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id !== "new") {
      const { data: user } = await http.get(config.usersEndPoint + "/" + id);

      this.setState({ user });
    }
  }
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schema);

    if (!error) return null;

    return error.details[0].message;
  };
  handleChange = ({ currentTarget: input }) => {
    const user = { ...this.state.user };
    user[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ user, errors });
  };
  validate() {
    const user = { ...this.state.user };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(user, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    let errors = this.validate();
    const user = { ...this.state.user };

    this.setState({ errors: errors || {} });

    if (errors) return;

    try {
      if (user.id === 0) {
        this.props.history.push("/users");
        await http.post(config.usersEndPoint, user);
        toast.success("user cusub ayaa la abooray");
      } else {
        this.props.history.push("/users");
        await http.put(config.usersEndPoint + "/" + user.id, user);
        toast.success("User ayaa wax laga badallay");
      }
    } catch (error) {
      this.props.history.push("/userForm/new");
      errors = { username: error.response.data };
      this.setState({ errors });
    }
  };
}

export default UserRegistration;
