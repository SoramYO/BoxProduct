module.exports = (query) => {
    let filterStatus = [
        { name: "Tất cả", status: "", class: "" },
        { name: "Đang kinh doanh", status: "active", class: "" },
        { name: "Ngừng kinh doanh", status: "inactive", class: "" },
    ]

    if (query.status) {
        const index = filterStatus.findIndex((item) => item.status === query.status);
        if (index > -1) {
            filterStatus[index].class = "active";
        }
    } else {
        filterStatus[0].class = "active";
    }
    return filterStatus;
};