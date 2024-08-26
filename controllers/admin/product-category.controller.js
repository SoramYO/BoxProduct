//[GET] /admin/product-category
module.exports.index = (req, res) => {
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh sách danh mục sản phẩm",
    });
}