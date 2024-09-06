const uploadFileToFirebase = require('../../helpers/firebaseUpload');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const bcrypt = require('bcrypt');

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    const accounts = await Account.find().select('--password');

    for (let i = 0; i < accounts.length; i++) {
        const role = await Role.findById(accounts[i].role_id);
        accounts[i].roleTitle = role.title;
    }
    for (const account of accounts) {
        const createBy = await Account.findById(_id = account.createBy.account_id);
        if (createBy) {
            account.createBy.fullName = createBy.fullName;
        }
    }
    for (const account of accounts) {
        const updateBy = await Account.findById(_id = account.updateBy.account_id);
        if (updateBy) {
            account.updateBy.fullName = updateBy.fullName;
        }
    }

    res.render('admin/pages/accounts/index', {
        pageTitle: 'Danh sách tài khoản',
        accounts: accounts
    });
}
//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const role = await Role.find();
    res.render('admin/pages/accounts/create', {
        roles: role
    });
}
//[POST] /admin/accounts/create
module.exports.createAccount = async (req, res) => {
    const existingAccount = await Account.findOne({ email: req.body.email });
    if (existingAccount) {
        req.flash('error', 'Email đã tồn tại');
        return res.redirect('back');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    let avatar = null;
    if (req.file) {
        avatar = await uploadFileToFirebase(req.file);
    }

    const token = Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
    const account = new Account({
        fullName: req.body.fullName,
        email: req.body.email,
        password: hashedPassword,
        token: token,
        phone: req.body.phone,
        avatar: req.file ? avatar : req.body.avatar,
        role_id: req.body.role_id,
        status: req.body.status,
        createBy: {
            account_id: res.locals.user._id,
            createAt: Date.now()
        }
    });
    await account.save();
    req.flash('success', 'Create account successfully');
    res.redirect('/admin/accounts');
}

//[GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
    const role = await Role.find();
    const accounts = await Account.findById(req.params.id);
    res.render('admin/pages/accounts/edit', {
        pageTitle: 'Chỉnh sửa tài khoản',
        account: accounts,
        roles: role
    });
}

//[PATCH] /admin/accounts/edit
module.exports.update = async (req, res) => {

    let avatar = null;
    if (req.file) {
        avatar = await uploadFileToFirebase(req.file);
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    } else {
        delete req.body.password;
    }
    req.body.avatar = req.file ? avatar : req.body.avatar;

    req.body.updateBy = {
        account_id: res.locals.user._id,
        updateAt: Date.now()
    };

    await Account.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Update account successfully');
    res.redirect('/admin/accounts');
}

module.exports.delete = async (req, res) => {
    await Account.updateOne({ _id: req.params.id }, { deleted: true, deleteBy: { account_id: res.locals.user._id, deleteAt: Date.now() } });
    res.redirect('/admin/accounts');
}
