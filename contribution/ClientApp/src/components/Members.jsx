import React, { Component } from "react";
import _ from "lodash";
import http from "../httpServices/services";
import config from "../config/config.json";
import Fontawesome from "react-fontawesome";
import SearchMember from "../utility/searchMember";
import Paginate from "../utility/pagination";
import Filtering from "../utility/Filter";
import Pagination from "./Pagination";
import ListGroup from "./ListGroup";
import Theader from "./Theaders";
import { toast } from "react-toastify";

class Members extends Component {
  state = {
    members: [],
    theadings: ["Magaca", "Mobile", "Wadanka", ""],
    filterBy: ["Dhamaan", "Dalka", "Dibada"],
    filter: "Dhamaan",
    sortColumn: { path: "name", order: "asc" },
    search: "",
    currentPage: 1,
  };

  render() {
    const {
      members: allMembers,
      filterBy,
      filter,
      theadings,
      sortColumn,
      search,
      currentPage,
    } = this.state;
    const { pageSize } = this.props;
    const searchedMembers = SearchMember(allMembers, search);
    const filterMembers = Filtering(searchedMembers, filter);
    const sort = _.orderBy(
      filterMembers,
      [sortColumn.path],
      [sortColumn.order]
    );
    const members = Paginate(sort, pageSize, currentPage);

    return (
      <React.Fragment>
        <div className="row">
          <div className="col-2 mt-4">
            <ListGroup
              items={filterBy}
              filter={filter}
              onFilter={this.handleFilter}
            />
          </div>

          <div className="col">
            <div className="row">
              <div className="col-10"></div>
              <div className="col-2">
                <button
                  className="btn btn-primary my-3"
                  onClick={this.HandleMemberForm}
                >
                  <Fontawesome className="fas fa-plus" name="plus" /> Diiwan
                  gali
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-9">
                <p>{filterMembers.length} qof ayaa diiwan gashan</p>
              </div>
              <div className="col-3">
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Ku raadi ..."
                  name="search"
                  value={search}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            {members.length !== 0 ? (
              <table className="table">
                <Theader
                  theading={theadings}
                  onSort={this.handleSort}
                  sortColumn={sortColumn}
                />
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <td>{m.name}</td>
                      <td>{m.phone}</td>
                      <td>{m.country}</td>
                      <td>
                        <button
                          onClick={() => this.handleDelete(m.id)}
                          className="btn btn-danger"
                        >
                          <Fontawesome
                            className="fas fa-trash"
                            name="trash"
                            style={{ fontSize: 20 }}
                          />
                        </button>
                        <button
                          onClick={() => this.handleUpdate(m.id)}
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
              <p className="text-center mt-4">Diiwanka qofna kuma jirro.</p>
            )}
            <Pagination
              count={filterMembers.length}
              pageSize={pageSize}
              currentPage={currentPage}
              onPagination={this.handlePagination}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
  async componentDidMount() {
    const { data: members } = await http.get(config.membersEndPoint);
    this.setState({ members });
  }
  handleFilter = (filter) => {
    this.setState({ filter, currentPage: 1 });
  };
  handleSort = (column) => {
    const sortColumn = { ...this.state.sortColumn };

    if (column == "Magaca") {
      if (sortColumn.path == "name") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "name";
        sortColumn.order = "asc";
      }
    }

    if (column == "Mobile") {
      if (sortColumn.path == "phone") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "phone";
        sortColumn.order = "asc";
      }
    }

    if (column == "Wadanka") {
      if (sortColumn.path == "country") {
        sortColumn.order = sortColumn.order == "asc" ? "desc" : "asc";
      } else {
        sortColumn.path = "country";
        sortColumn.order = "asc";
      }
    }

    this.setState({ sortColumn, currentPage: 1 });
  };
  handleChange = ({ currentTarget: input }) => {
    this.setState({ search: input.value.toLocaleLowerCase(), currentPage: 1 });
  };
  handlePagination = (currentPage) => {
    this.setState({ currentPage });
  };
  HandleMemberForm = () => {
    this.props.history.push("/membersForm/new");
  };
  handleUpdate = async (id) => {
    this.props.history.push("/membersForm/" + id);
  };
  handleDelete = async (id) => {
    const Originalmembers = [...this.state.members];
    const members = [...Originalmembers.filter((m) => m.id !== id)];
    this.setState({ members, show: false });

    try {
      await http.delete(config.membersEndPoint + "/" + id);
      toast.success("Waa la tuuray!");
    } catch (e) {
      toast.error("Qalad ayaa dhacay!");
      this.setState({ members: Originalmembers });
    }
  };
}

export default Members;
