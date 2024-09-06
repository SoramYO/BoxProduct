const Account = require("../models/account.model");
const systemConfig = require('../config/system');
const Role = require("../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect(`/${systemConfig.ADMIN_PATH}/auth/login`);
    }
    const account = await Account.findOne({ token: token, status: "active", deleted: false, }).select('-password');
    if (!account) {
        res.clearCookie("token");
        return res.redirect(`/${systemConfig.ADMIN_PATH}/auth/login`);
    }

    const role = await Role.findById({ _id: account.role_id, deleted: "false" }).select('title permissions');
    res.locals.user = account;
    res.locals.role = role;
    next();
}