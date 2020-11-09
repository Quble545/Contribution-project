import React, { Component } from "react";
import Config from "../config/config.json";
import axios from "../httpServices/services";
import Fontawesome from "react-fontawesome";
import Pagination from "./Pagination";
import Paginate from "../utility/pagination";
import ListGroup from "./ListGroup";
import filtering from "../utility/paymentsFilter";
import Theader from "./THeaderPayments";
import _ from "lodash";
import SearchBy from "../utility/searchPayment";
import http from "../httpServices/services";
import config from "../config/config.json";
import { toast } from "react-toastify";

class Payment extends Component {
  state = {
    theads: ["Lacagta", "Ujeedada", "Taarikhda", "", ""],
    currentPage: 1,
    filterBy: ["Dhamaan", "Sanadkan", "Bishan"],
    filter: "Dhamaan",
    sortColumn: { path: "amount", order: "asc" },
    search: "",
    payments: [],
  };
  render() {
    const {
      theads,
      currentPage,
      filter,
      filterBy,
      sortColumn,
      search,
      payments: allPayments,
    } = this.state;
    const { pageSize } = this.props;
    const searching = SearchBy(allPayments, search);
    const filterPayments = filtering(searching, filter);
    const sorted = _.orderBy(
      filterPayments,
      [sortColumn.path],
      [sortColumn.order]
    );
    const payments = Paginate(sorted, pageSize, currentPage);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-2">
            <ListGroup
              items={filterBy}
              filter={filter}
              onFilter={this.handleFilter}
            />
            <br />
            <ul className="list-group">
              <li className="list-group-item">
                Lacagta good: $
                {allPayments
                  .map((p) => p.amount)
                  .reduce(function (a, b) {
                    return a + b;
                  }, 0)}
              </li>
              <li className="list-group-item">
                Sanadkan: $
                {allPayments
                  .filter((p) => {
                    let date = new Date(p.date);
                    let current = new Date();

                    return date.getFullYear() === current.getFullYear();
                  })
                  .map((p) => p.amount)
                  .reduce(function (a, b) {
                    return a + b;
                  }, 0)}
              </li>
              <li className="list-group-item">
                Bishan: $
                {allPayments
                  .filter((p) => {
                    let date = new Date(p.date);
                    let current = new Date();

                    return (
                      date.getMonth() === current.getMonth() &&
                      date.getFullYear() === current.getFullYear()
                    );
                  })
                  .map((p) => p.amount)
                  .reduce(function (a, b) {
                    return a + b;
                  }, 0)}
              </li>
            </ul>
          </div>
          <div className="col">
            <div className="row my-3">
              <div className="col-9"></div>
              <div className="col">
                <button
                  onClick={this.handlePaymentForm}
                  className="btn btn-primary"
                >
                  <Fontawesome className="fas fa-plus" name="plus" /> Lacag
                  bixin
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-9">
                <p>{filterPayments.length} jeer ayaa lacag labixiyay</p>
              </div>
              <div className="col mb-2">
                <input
                  value={search}
                  onChange={this.hanldeChange}
                  type="text"
                  name="search"
                  className="form-control"
                  placeholder="Ku raadi ..."
                />
              </div>
            </div>
            {payments.length !== 0 ? (
              <table className="table">
                <Theader
                  theading={theads}
                  onSort={this.handleSort}
                  sortColumn={sortColumn}
                />
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td>${p.amount}</td>
                      <td>{p.purpose}</td>
                      <td>{this.handleDate(p.date)}</td>
                      <td>
                        <button
                          onClick={() => this.handleDeletePayment(p.id)}
                          className="btn btn-danger"
                        >
                          <Fontawesome
                            className="fas fa-trash"
                            name="trash"
                            style={{ fontSize: 20 }}
                          />
                        </button>
                        <button
                          onClick={() => this.handleUpdate(p.id)}
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
              </table>
            ) : (
              <p className="text-center mt-4">Wali lacag labixiyay majirto.</p>
            )}
            <Pagination
              pageSize={pageSize}
              count={filterPayments.length}
              currentPage={currentPage}
              onPagination={this.handelPagination}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleUpdate = (id) => {
    this.props.history.push("/paymentForm/" + id);
  };
  handlePaymentForm = () => {
    this.props.history.push("/paymentForm/new");
  };
  hanldeChange = ({ currentTarget: input }) => {
    this.setState({ search: input.value.toLocaleLowerCase() });
  };
  handleSort = (column) => {
    const sortColumn = { ...this.state.sortColumn };

    if (column == "Lacagta") {
      if (sortColumn.path == "amount") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "amount";
        sortColumn.order = "asc";
      }
    }

    if (column == "Ujeedada") {
      if (sortColumn.path == "purpose") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "purpose";
        sortColumn.order = "asc";
      }
    }

    if (column == "Taarikhda") {
      if (sortColumn.path == "date") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "date";
        sortColumn.order = "asc";
      }
    }

    this.setState({ sortColumn });
  };

  handleFilter = (filter) => {
    this.setState({ filter, currentPage: 1 });
  };
  handelPagination = (currentPage) => {
    this.setState({ currentPage });
  };
  handleDate(date) {
    const exactDate = new Date(date);

    return exactDate.toDateString();
  }
  async componentDidMount() {
    const { data: payments } = await axios.get(Config.paymentEndPoint);
    this.setState({ payments });
  }
  handleDeletePayment = async (id) => {
    const payments = [...this.state.payments];
    const newPayments = [...payments.filter((p) => p.id !== id)];
    this.setState({ payments: newPayments });

    try {
      await http.delete(config.paymentEndPoint + "/" + id);
      toast.success("Waa la tuuray");
    } catch (error) {
      toast.error("Qallad ayaa dhacay!");
      this.setState({ payments });
    }
  };
}

export default Payment;
