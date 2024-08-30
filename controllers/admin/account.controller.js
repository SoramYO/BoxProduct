const Account = require('../../models/account.model');

module.exports.index = async (req, res) => {
    const accounts = await Account.find();
    res.render('admin/account/index', {
        accounts: accounts
    });
}

module.exports.create = (req, res) => {
    res.render('admin/account/create');
}

module.exports.createAccount = async (req, res) => {
    const account = new Account(req.body);
    await account.save();
    res.redirect('/admin/accounts');
}

module.exports.edit = async (req, res) => {
    const account = await Account.findById(req.params.id);
    res.render('admin/account/edit', {
        account: account
    });
}

module.exports.update = async (req, res) => {
    await Account.updateOne({ _id: req.params.id }, req.body);
    res.redirect('/admin/accounts');
}

module.exports.delete = async (req, res) => {
    await Account.deleteOne({ _id: req.params.id });
    res.redirect('/admin/accounts');
}
