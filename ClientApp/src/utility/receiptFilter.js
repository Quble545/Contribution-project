import Receipt from "../components/Receipts";

function filter(reciepts, filter) {
  let current = new Date();

  if (filter === "Sanadkan") {
    return reciepts.filter((r) => {
      let date = new Date(r.date);

      return date.getFullYear() === current.getFullYear();
    });
  }
  if (filter === "Bishan") {
    console.log(current);

    return reciepts.filter((r) => {
      let date = new Date(r.date);
      return (
        date.getMonth() === current.getMonth() &&
        date.getFullYear() === current.getFullYear()
      );
    });
  }

  return reciepts;
}

export default filter;
