const Role = require("../../models/role.model");
const systemConfig = require('../../config/system');
const Account = require("../../models/account.model");

module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const roles = await Role.find(find).sort({ position: 'asc' });
    for (const role of roles) {
        const account = await Account.findById(_id = role.createdBy.account_id);
        if (account) {
            role.createdBy.fullName = account.fullName;
        }
    }
    for (const role of roles) {
        const account = await Account.findById(_id = role.updatedBy.account_id);
        if (account) {
            role.updatedBy.fullName = account.fullName;
        }
    }

    res.render("admin/pages/roles/index", {
        pageTitle: "Danh sách quyền",
        roles: roles,
    });
}
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", {
        pageTitle: "Thêm quyền",
    });
}
// [POST] /admin/roles/create
module.exports.createRole = async (req, res) => {
    try {
        const countRoles = await Role.countDocuments();
        const role = new Role({
            title: req.body.title,
            description: req.body.description,
            permissions: req.body.permissions,
            createdBy: {
                account_id: res.locals.user._id,
                createAt: Date.now()
            }
        });

        await role.save();

        req.flash('success', `Thêm quyền ${role.name} thành công`);
        res.redirect('/admin/roles');
    } catch (error) {
        console.error('Lỗi khi thêm quyền:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi thêm quyền', error.message);
        res.redirect('back');
    }
}
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
    const role = await Role.findById(req.params.id);
    res.render("admin/pages/roles/edit", {
        pageTitle: "Sửa quyền",
        roleEdit: role,
    });
}
// [PUT] /admin/roles/edit/:id
module.exports.update = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);

        role.title = req.body.title;
        role.description = req.body.description;
        role.updatedBy = {
            account_id: res.locals.user._id,
            updateAt: Date.now()
        };

        await role.save();

        req.flash('success', `Sửa quyền ${role.name} thành công`);
        res.redirect(`/${systemConfig.ADMIN_PATH}/roles`);
    } catch (error) {
        console.error('Lỗi khi sửa quyền:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi sửa quyền', error.message);
        res.redirect('back');
    }
}

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
    const records = await Role.find({
        deleted: false
    });

    res.render("admin/pages/roles/permissions", {
        pageTitle: "Phân quyền",
        records: records
    });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
    const roles = JSON.parse(req.body.roles)

    for (const role of roles) {
        await Role.updateOne({
            _id: role.id,
            deleted: false
        }, {
            permissions: role.permissions,
            updatedBy: {
                account_id: res.locals.user._id,
                updateAt: Date.now()
            }
        });
    }

    req.flash('success', 'Phân quyền thành công');
    res.redirect(`/${systemConfig.ADMIN_PATH}/roles/permissions`);
};