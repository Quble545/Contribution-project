function Search(items, search) {
  let reciepts = items.filter((r) =>
    r.member.name.toLocaleLowerCase().startsWith(search)
  );

  if (reciepts.length !== 0) return reciepts;

  reciepts = items.filter((r) =>
    r.bank.bank.toLocaleLowerCase().startsWith(search)
  );

  if (reciepts.length !== 0) return reciepts;

  reciepts = items.filter((r) =>
    r.bank.account.toLocaleLowerCase().startsWith(search)
  );

  if (reciepts.length !== 0) return reciepts;

  reciepts = items.filter((r) => r.amount.toString().startsWith(search));

  if (reciepts.length !== 0) return reciepts;

  return reciepts;
}

export default Search;
