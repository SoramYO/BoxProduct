module.exports = (query) => {
    let search = {
        keyword: "",
        keywordRegex: "",
    };

    if (query.keyword) {
        search.keyword = query.keyword;
        const keywordRegex = new RegExp(search.keyword, "i");
        search.keywordRegex = keywordRegex;
    }

    return search;
}