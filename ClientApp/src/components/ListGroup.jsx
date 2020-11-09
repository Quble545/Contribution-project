import React, { Component } from "react";

class ListGroup extends Component {
  render() {
    const { items, filter, onFilter } = this.props;

    return (
      <ul className="list-group mt-5">
        {items.map((f) => (
          <li
            onClick={() => onFilter(f)}
            className={
              filter === f ? "list-group-item active" : "list-group-item"
            }
            key={f}
          >
            {f}
          </li>
        ))}
      </ul>
    );
  }
}

export default ListGroup;
