import _ from 'lodash';

function Pagination(items, pageSize, currentPage) {
    const index = (currentPage - 1)*pageSize;
    
    return _(items).slice(index).take(pageSize).value();
}


export default Pagination;