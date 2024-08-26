module.exports = (query) => {
    let sort = {};

    if (query.sortKey && query.sortValue) {
        const sortKey = query.sortKey;
        const sortValue = query.sortValue;
        sort[sortKey] = sortValue;
    } else {
        sort.position = "desc";
    }

    return sort;
}