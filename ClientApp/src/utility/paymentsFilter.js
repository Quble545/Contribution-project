function filter(items, filter) {
  const currentDate = new Date();

  if (filter === "Sanadkan") {
    return items.filter((p) => {
      let date = new Date(p.date);

      return currentDate.getFullYear() === date.getFullYear();
    });
  }

  if (filter === "Bishan") {
    return items.filter((p) => {
      const date = new Date(p.date);
      console.log(currentDate.getMonth() + "/" + date.getMonth());
      return (
        date.getMonth() === currentDate.getMonth() &&
        currentDate.getFullYear() === date.getFullYear()
      );
    });
  }

  return items;
}

export default filter;
