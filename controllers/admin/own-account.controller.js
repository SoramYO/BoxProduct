//[GET] /admin/own-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/own-account/index", {
        pageTitle: "Thông tin tài khoản",
    });
}