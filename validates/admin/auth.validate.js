module.exports.postLogin = async (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Hãy nhập email');
        return res.redirect('back');
    }
    if (!req.body.password) {
        req.flash('error', 'Hãy nhập mật khẩu');
        return res.redirect('back');
    }
    next();
}