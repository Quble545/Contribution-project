import React, { Component } from "react";
import joi from "joi-browser";
import http from "../httpServices/services";
import config from "../config/config.json";
import { toast } from "react-toastify";

class MemberForm extends Component {
  state = {
    member: { id: 0, name: "", phone: "", country: "" },
    error: {},
    show: false,
  };
  schema = {
    id: joi.number().allow(""),
    name: joi.string().required().label("Magaca"),
    phone: joi.string().required().label("Mobile"),
    country: joi.string().required().label("Wadanka"),
  };
  render() {
    const { member, error } = this.state;
    return (
      <React.Fragment>
        <h3>Diiwanka xubnaha</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Magac</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={member.name}
              onChange={this.handleChange}
            />
            {error["name"] && (
              <div className="alert alert-danger">{error["name"]}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Mobile</label>
            <input
              id="phone"
              name="phone"
              type="text"
              className="form-control"
              value={member.phone}
              onChange={this.handleChange}
            />
            {error["phone"] && (
              <div className="alert alert-danger">{error["phone"]}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="country">Wadanka</label>
            <input
              id="country"
              name="country"
              type="text"
              className="form-control"
              value={member.country}
              onChange={this.handleChange}
            />
            {error["country"] && (
              <div className="alert alert-danger">{error["country"]}</div>
            )}
          </div>
          <button disabled={this.validate()} className="btn btn-primary">
            Save
          </button>
        </form>
      </React.Fragment>
    );
  }
  handleSubmit = async (e) => {
    e.preventDefault();

    var member = { ...this.state.member };
    const errors = this.validate();
    this.setState({ error: errors || {} });

    if (errors) return;

    if (member.id !== 0) {
      try {
        this.props.history.push("/members");

        const result = await http.put(
          config.membersEndPoint + "/" + member.id,
          member
        );

        toast.success("Waaa lagu guulestay wax ka badalida diiwanka");
      } catch {
        toast.error("Qallad ayaa dhacay, markalle isku day");
      }
    } else {
      try {
        this.props.history.push("/members");
        const result = await http.post(config.membersEndPoint, member);
        toast.success("Waaa lagu guulestay diiwan gallinta cusub");
      } catch {
        toast.error("Qallad ayaa dhacay, markalle isku day");
      }
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const member = { ...this.state.member };
    member[input.name] = input.value;
    const errorMessage = this.validateProperty(input);
    const error = { ...this.state.error };

    if (errorMessage) error[input.name] = errorMessage;
    else delete error[input.name];

    this.setState({ member, error });
  };
  validate() {
    const member = { ...this.state.member };
    const option = { abortEarly: false };
    const errors = {};
    const { error } = joi.validate(member, this.schema, option);

    if (!error) return null;

    if (error) {
      for (let e of error.details) errors[e.path[0]] = e.message;
    }

    return errors;
  }
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schem = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schem);

    if (error) return error.details[0].message;

    return null;
  };
  async componentDidMount() {
    const { id } = this.props.match.params;

    if (id !== "new") {
      const { data } = await http.get(config.membersEndPoint + "/" + id);

      if (!data) this.props.history.push("/not-found");

      this.setState({ member: data });
    }
  }
}

export default MemberForm;
