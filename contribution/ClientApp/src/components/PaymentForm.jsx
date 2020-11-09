import React, { Component } from "react";
import joi from "joi-browser";
import http from "../httpServices/services";
import config from "../config/config.json";
import { toast } from "react-toastify";

class PaymentForm extends Component {
  state = {
    payment: { id: 0, amount: "", purpose: "", date: new Date() },
    errors: {},
  };

  schema = {
    id: joi.number().allow(0),
    amount: joi.number().min(1).max(10000).required().label("Lacagta"),
    purpose: joi.string().min(5).required().label("Ujeedada"),
    date: joi.date(),
  };

  render() {
    const { payment, errors } = this.state;
    return (
      <React.Fragment>
        <h3>Diiwanka lacag bixinta</h3>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Lacagta</label>
            <input
              value={payment.amount}
              onChange={this.handleChange}
              type="text"
              id="amount"
              name="amount"
              className="form-control"
              placeholder="$0.00"
            />
            {errors["amount"] && (
              <div className="alert alert-danger">{errors["amount"]}</div>
            )}
          </div>

          <div className="form-group">
            <textarea
              value={payment.purpose}
              onChange={this.handleChange}
              name="purpose"
              id="purpose"
              cols="15"
              rows="5"
              className="form-control"
              placeholder="Fah faahin ..."
            />
            {errors["purpose"] && (
              <div className="alert alert-danger">{errors["purpose"]}</div>
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
      const { data: payment } = await http.get(
        config.paymentEndPoint + "/" + id
      );

      if (!payment) this.props.history.push("/not-found");

      this.setState({ payment });
    }
  }
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };
    const { error } = joi.validate(obj, schema);

    if (!error) return null;

    return error.details[0].message;
  };
  validate() {
    const payment = { ...this.state.payment };
    const errors = {};
    const option = { abortEarly: false };
    const { error } = joi.validate(payment, this.schema, option);

    if (!error) return null;

    for (let e of error.details) errors[e.path[0]] = e.message;

    return errors;
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    const error = this.validate();
    const payment = { ...this.state.payment };

    this.setState({ errors: error || {} });

    if (error) return;

    try {
      if (payment.id === 0) {
        payment.amount = parseInt(payment.amount);
        payment.date = payment.date.toISOString();
        this.props.history.push("/payments");

        const { data } = await http.post(config.paymentEndPoint, payment);
        toast.success("Waa lagu guuleystay lacag bixinta.");
      } else {
        payment.amount = parseInt(payment.amount);
        this.props.history.push("/payments");

        await http.put(config.paymentEndPoint + "/" + payment.id, payment);
        toast.success("Waa lagu guuleystay wax ka badalida");
      }
    } catch (error) {
      toast.error("Qallad ayaa dhacay!");
    }
  };
  handleChange = ({ currentTarget: input }) => {
    const payment = { ...this.state.payment };
    payment[input.name] = input.value;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);

    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    this.setState({ payment, errors });
  };
}

export default PaymentForm;
