import React, { Component } from "react";
import _ from "lodash";

class Pagination extends Component {
  render() {
    const { count, pageSize, currentPage, onPagination } = this.props;
    const pages = Math.ceil(count / pageSize);
    const pageNumbers = _.range(1, pages + 1);

    if (pages === 1) return null;

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {pageNumbers.map((p) => (
            <li
              className={p === currentPage ? "page-item active" : "page-item"}
              key={p}
            >
              <a onClick={() => onPagination(p)} className="page-link">
                {p}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}

export default Pagination;
