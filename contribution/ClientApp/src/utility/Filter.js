
function Filter(members, filter){
    if(filter === 'Dalka')
        return members.filter(m => m.country.toLocaleLowerCase().startsWith('soo') || m.country.toLocaleLowerCase().startsWith('som'))

    if(filter === 'Dibada')
        return members.filter(m => !(m.country.toLocaleLowerCase().startsWith('soo') || m.country.toLocaleLowerCase().startsWith('som')))

    return members;
}

export default Filter;