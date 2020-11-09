function Search(items, search) {
  if (search === "") return items;

  let payments = items.filter((p) =>
    p.purpose.toLocaleLowerCase().startsWith(search)
  );

  if (payments.length !== 0) return payments;

  payments = items.filter((p) => p.amount.toString().startsWith(search));

  return payments;
}

export default Search;
