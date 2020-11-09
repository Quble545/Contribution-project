import React, { Component } from "react";
import http from "../httpServices/services";
import config from "../config/config.json";
import ListGroup from "./ListGroup";
import Filtering from "../utility/receiptFilter";
import Pagination from "./Pagination";
import Paginate from "../utility/pagination";
import Theader from "./THeaderReciepts";
import _ from "lodash";
import Searching from "../utility/searchReciept";
import Fontawesome from "react-fontawesome";
import { toast } from "react-toastify";

class Receipt extends Component {
  state = {
    reciepts: [],
    filterBy: ["Dhamaan", "Sanadkan", "Bishan"],
    theader: ["Magaca", "Bangiga", "Accounka", "Lacagta", "Taarikhda", "", ""],
    filter: "Dhamaan",
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    search: "",
  };
  render() {
    const {
      reciepts: allReciepts,
      filter,
      filterBy,
      currentPage,
      theader,
      sortColumn,
      search,
    } = this.state;
    const { pageSize } = this.props;
    const searchBy = Searching(allReciepts, search);
    const filtered = Filtering(searchBy, filter);
    const sort = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const reciepts = Paginate(sort, pageSize, currentPage);

    return (
      <React.Fragment>
        <div className="row mt-3">
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
                {allReciepts.length !== 0
                  ? allReciepts
                      .map((r) => r.amount)
                      .reduce(function (a, b) {
                        return a + b;
                      }, 0)
                  : 0}
              </li>
              <li className="list-group-item">
                Sanadkan: $
                {allReciepts.length !== 0
                  ? allReciepts
                      .filter((r) => {
                        let current = new Date();
                        let date = new Date(r.date);

                        if (current.getFullYear() === date.getFullYear()) {
                          return r.amount;
                        }
                      })
                      .map((r) => r.amount)
                      .reduce(function (a, b) {
                        return a + b;
                      }, 0)
                  : 0}
              </li>
              <li className="list-group-item">
                Bishan: $
                {allReciepts.length !== 0
                  ? allReciepts
                      .filter((r) => {
                        let current = new Date();
                        let date = new Date(r.date);

                        if (
                          current.getMonth() === date.getMonth() &&
                          current.getFullYear() === date.getFullYear()
                        ) {
                          return r.amount;
                        }
                      })
                      .map((r) => r.amount)
                      .reduce(function (a, b) {
                        return a + b;
                      }, 0)
                  : 0}
              </li>
            </ul>
          </div>

          <div className="col">
            <div className="row">
              <div className="col-9"></div>
              <div className="col-3">
                <button
                  className="btn btn-primary my-2"
                  onClick={this.handleRecieptForm}
                >
                  <Fontawesome className="fas fa-plus" name="plus" /> Lacag
                  qabasho
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-9">
                <p>{filtered.length} jeer ayaa lacag laqabtay</p>
              </div>
              <div className="col mb-2">
                <input
                  value={this.state.search}
                  onChange={this.handleChange}
                  className="form-control"
                  placeholder="Ku raadi ..."
                />
              </div>
            </div>
            {reciepts.length !== 0 ? (
              <table className="table">
                <Theader
                  theading={theader}
                  sortColumn={sortColumn}
                  onSort={this.handleSort}
                />
                <tbody>
                  {reciepts.map((r) => (
                    <tr key={r.id}>
                      <td>{r.member.name}</td>
                      <td>{r.bank.bank}</td>
                      <td>{r.bank.account}</td>
                      <td>${r.amount}</td>
                      <td>{this.handleDate(r.date)}</td>
                      <td>
                        <button
                          onClick={() => this.handleDelete(r.id)}
                          className="btn btn-danger"
                        >
                          <Fontawesome
                            className="fas fa-trash"
                            name="trash"
                            style={{ fontSize: 20 }}
                          />
                        </button>
                        <button
                          onClick={() => this.handleUpdate(r.id)}
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
              <p className="text-center mt-4">Wali lacag laqabtay majirto.</p>
            )}
            <Pagination
              count={filtered.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPagination={this.handlePagination}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
  handleRecieptForm = () => {
    this.props.history.push("/recieptForm/new");
  };
  handleUpdate = (id) => {
    this.props.history.push("/recieptForm/" + id);
  };
  handleDelete = async (id) => {
    const reciepts = [...this.state.reciepts];
    const filter = [...reciepts.filter((r) => r.id !== id)];

    this.setState({ reciepts: filter });

    try {
      await http.delete(config.recieptsEndPoint + "/" + id);
      toast.success("waa la tuuray.");
    } catch (error) {
      this.setState({ reciepts });
      toast.error("Qallad ayaa dhacay!.");
    }
  };
  handleChange = ({ currentTarget: input }) => {
    this.setState({ search: input.value.toLocaleLowerCase() });
  };
  handleSort = (column) => {
    const sortColumn = { ...this.state.sortColumn };

    if (column == "Magaca") {
      if (sortColumn.path == "member.name") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "member.name";
        sortColumn.order = "asc";
      }
    }

    if (column == "Bangiga") {
      if (sortColumn.path == "bank.bank") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "bank.bank";
        sortColumn.order = "asc";
      }
    }

    if (column == "Accounka") {
      if (sortColumn.path == "bank.account") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "bank.account";
        sortColumn.order = "asc";
      }
    }

    if (column == "Lacagta") {
      if (sortColumn.path == "amount") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "amount";
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

    this.setState({ sortColumn, currentPage: 1 });
  };
  handlePagination = (currentPage) => {
    this.setState({ currentPage });
  };
  handleFilter = (filter) => {
    this.setState({ filter });
  };
  async componentDidMount() {
    const { data } = await http.get(config.recieptsEndPoint);
    this.setState({ reciepts: data });
  }
  handleDate(date) {
    let shortDate = new Date(date);
    return shortDate.toDateString();
  }
}

export default Receipt;
