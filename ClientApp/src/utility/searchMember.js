
function Search(members, search){
    let result = members.filter(m => m.name.toLocaleLowerCase().startsWith(search))

    if(search.trim() === "")
        return members;

    if(result.length !== 0)
        return result;

    result = members.filter(m => m.phone.toString().startsWith(search));

    if(result.length !== 0)
        return result;

    result = members.filter(m => m.country.toLocaleLowerCase().startsWith(search));

    return result;
}

export default Search;