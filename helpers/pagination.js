module.exports = (query, countProducts) => {

    let pagination = {
        currentPage: 1,
        limit: 10,
    };

    if (query.page) {
        pagination.currentPage = parseInt(query.page);
    }

    pagination.skip = (pagination.currentPage - 1) * pagination.limit;

    const totalPages = Math.ceil(countProducts / pagination.limit);

    pagination.totalPages = totalPages;

    return pagination;
}