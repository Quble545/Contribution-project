import React, { Component } from "react";
import http from "../httpServices/services";
import config from "../config/config.json";
import joi from "joi-browser";
import { toast } from "react-toastify";

class RecieptForm extends Component {
  state = {
    members: [],
    banks: [],
    reciept: { id: 0, memberId: 0, bankId: 0, amount: "", date: new Date() },
    errors: {},
  };
  schema = {
    id: joi.number().allow(0),
    memberId: joi.number().required().label("Xubin"),
    bankId: joi.number().required().label("Bangiga"),
    amount: joi.number().max(10000).min(1).required().label("lacagta"),
    date: joi.date().required().label("taarikh"),
  };
  render() {
    const { members, banks, reciept, errors } = this.state;

    return (
      <React.Fragment>
        <h3>Diiwanka lacag qabashada</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="member">Doro xubin</label>
            <select
              onChange={this.handleChange}
              value={reciept.memberId}
              name="memberId"
              id="member"
              className="form-control"
            >
              <option value="">Doro qof</option>
              {members.map((m) => (
                <option value={m.id}>{m.name}</option>
              ))}
            </select>
            {errors["memberId"] && (
              <div className="alert alert-danger">{errors["memberId"]}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="bank">Doro bangiga</label>
            <select
              onChange={this.handleChange}
              value={reciept.bankId}
              name="bankId"
              id="bank"
              className="form-control"
            >
              <option value=""> Doro bangiga</option>
              {banks.map((b) => (
                <option value={b.id}>{b.bank}</option>
              ))}
            </select>
            {errors["bankId"] && (
              <div className="alert alert-danger">{errors["bankId"]}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="amount">Lacagta</label>
            <input
              onChange={this.handleChange}
              value={reciept.amount}
              name="amount"
              type="text"
              className="form-control"
              placeholder="$0.00"
            />
            {errors["amount"] && (
              <div className="alert alert-danger">{errors["amount"]}</div>
            )}
          </div>
          <button disabled={this.validate()} className="btn btn-primary">
            Save
          </button>
        </form>
      </React.Fragment>
    );
  }
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schem = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schem);

    if (error) return error.details[0].message;

    return null;
  };
  validate = () => {
    const errors = {};
    const reciept = { ...this.state.reciept };
    const option = { abortEarly: false };
    const { error } = joi.validate(reciept, this.schema, option);
    console.log(error);
    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  };
  handleChange = ({ currentTarget: input }) => {
    const reciept = { ...this.state.reciept };
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    reciept[input.name] = input.value;

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ reciept, errors });
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    const reciept = { ...this.state.reciept };
    reciept.amount = parseInt(reciept.amount);
    reciept.memberId = parseInt(reciept.memberId);
    reciept.bankId = parseInt(reciept.bankId);

    const error = this.validate();
    this.setState({ errors: error || {} });

    if (error) return;

    try {
      if (reciept.id === 0) {
        reciept.date = reciept.date.toISOString();

        this.props.history.push("/receipts");
        await http.post(config.recieptsEndPoint, reciept);
        toast.success("Waa lagu guuleystay lacag qabashada.");
      } else {
        this.props.history.push("/receipts");
        await http.put(config.recieptsEndPoint + "/" + reciept.id, reciept);
        toast.success(
          "Waa lagu guuleystay wax ka badalida lacag horrey loo qabtay."
        );
      }
    } catch (error) {
      toast.error("Qallad ayaa dhacay!");
    }
  };
  async componentDidMount() {
    const { data: members } = await http.get(config.membersEndPoint);
    const { data: banks } = await http.get(config.banksEndPoint);
    const { id } = this.props.match.params;
    let reciept = { ...this.state.reciept };

    if (id !== "new") {
      const { data } = await http.get(config.recieptsEndPoint + "/" + id);

      if (!data) return this.props.history.push("/not-found");

      delete data["bank"];
      delete data["member"];
      reciept = data;

      reciept.amount = parseInt(reciept.amount);
      reciept.memberId = parseInt(reciept.memberId);
      reciept.bankId = parseInt(reciept.bankId);
    }

    this.setState({ members, banks, reciept });
  }
}

export default RecieptForm;
