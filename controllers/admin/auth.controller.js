const Account = require("../../models/account.model");
const bcrypt = require('bcrypt');
const systemConfig = require('../../config/system');
//[GET] /admin/auth/login
module.exports.login = (req, res) => {
    if (req.cookies.token) {
        return res.redirect(`/${systemConfig.ADMIN_PATH}/dashboard`);
    }
    res.render('admin/pages/auth/login', {
        pageTitle: 'Đăng nhập'
    });
}


//[POST] /admin/auth/login
module.exports.loginCheck = async (req, res) => {
    const account = await Account.findOne({ email: req.body.email, deleted: false });
    if (!account) {
        req.flash('error', 'Email không tồn tại');
        return res.redirect('back');
    }
    const match = await bcrypt.compare(req.body.password, account.password);
    if (!match) {
        req.flash('error', 'Mật khẩu không chính xác');
        return res.redirect('back');
    }
    if (account.status === 'inactive') {
        req.flash('error', 'Tài khoản của bạn đã bị khóa');
        return res.redirect('back');
    }
    res.cookie('token', account.token);
    res.redirect(`/${systemConfig.ADMIN_PATH}/dashboard`);
}

//[GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`/${systemConfig.ADMIN_PATH}/auth/login`);
}