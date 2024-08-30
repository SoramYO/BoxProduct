module.exports.createProduct = async (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề');
        return res.redirect('back');
    }
    if (req.body.title.length < 3 || req.body.title.length > 255) {
        req.flash('error', 'Tiêu đề phải từ 3 đến 255 ký tự');
        return res.redirect('back');
    }
    next();
}
module.exports.editProduct = async (req, res, next) => {
    if (!req.body.title) {
        req.flash('error', 'Vui lòng nhập tiêu đề');
        return res.redirect('back');
    }
    if (req.body.title.length < 3 || req.body.title.length > 255) {
        req.flash('error', 'Tiêu đề phải từ 3 đến 255 ký tự');
        return res.redirect('back');
    }
    next();
}