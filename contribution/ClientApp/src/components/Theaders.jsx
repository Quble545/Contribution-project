import React from "react";
import FontAwesome from "react-fontawesome";

const Theader = (props) => {
  const { theading, onSort, sortColumn } = props;

  return (
    <thead>
      <tr>
        {theading.map((th) => (
          <th onClick={() => onSort(th)} key={th}>
            {icon(sortColumn, th)}
            {th}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const icon = (sortColumn, th) => {
  if (sortColumn.path == "name" && th == "Magaca") {
    return sortColumn.order == "asc" ? (
      <FontAwesome className="fad fa-sort-up mx-1" name="arrow" />
    ) : (
      <FontAwesome className="fad fa-sort-down mx-1" name="arrow" />
    );
  }

  if (sortColumn.path == "phone" && th == "Mobile") {
    return sortColumn.order == "asc" ? (
      <FontAwesome className="fad fa-sort-up mx-1" name="arrow" />
    ) : (
      <FontAwesome className="fad fa-sort-down mx-1" name="arrow" />
    );
  }

  if (sortColumn.path == "country" && th == "Wadanka") {
    return sortColumn.order == "asc" ? (
      <FontAwesome className="fad fa-sort-up mx-1" name="arrow" />
    ) : (
      <FontAwesome className="fad fa-sort-down mx-1" name="arrow" />
    );
  }
};

export default Theader;
