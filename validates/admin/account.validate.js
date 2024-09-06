const { model } = require("mongoose");

module.exports.createAccount = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên');
        return res.redirect('back');
    }
    if (req.body.fullName.length < 3 || req.body.fullName.length > 255) {
        req.flash('error', 'Họ tên phải từ 3 đến 255 ký tự');
        return res.redirect('back');
    }
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect('back');
    }
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        return res.redirect('back');
    }
    if (req.body.password.length < 6) {
        req.flash('error', 'Mật khẩu phải lớn hơn 6 ký tự');
        return res.redirect('back');
    }
    if (!req.body.phone) {
        req.flash('error', 'Vui lòng nhập số điện thoại');
        return res.redirect('back');
    }
    if (!req.body.role_id) {
        req.flash('error', 'Vui lòng chọn quyền');
        return res.redirect('back');
    }
    next();
}

module.exports.updateAccount = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên');
        return res.redirect('back');
    }
    if (req.body.fullName.length < 3 || req.body.fullName.length > 255) {
        req.flash('error', 'Họ tên phải từ 3 đến 255 ký tự');
        return res.redirect('back');
    }
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect('back');
    }
    if (!req.body.phone) {
        req.flash('error', 'Vui lòng nhập số điện thoại');
        return res.redirect('back');
    }
    if (!req.body.role_id) {
        req.flash('error', 'Vui lòng chọn quyền');
        return res.redirect('back');
    }
    next();
}