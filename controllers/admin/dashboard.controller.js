const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');
const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
//[GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0,
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0,
        },
    };
    statistic.product.total = await Product.countDocuments();
    statistic.product.active = await Product.countDocuments({ status: 'active' });
    statistic.product.inactive = await Product.countDocuments({ status: 'inactive' });
    statistic.categoryProduct.total = await ProductCategory.countDocuments();
    statistic.categoryProduct.active = await ProductCategory.countDocuments({ status: 'active' });
    statistic.categoryProduct.inactive = await ProductCategory.countDocuments({ status: 'inactive' });

    const userRole = await Role.findOne({ title: 'User' });
    statistic.user.total = await Account.countDocuments({ role_id: userRole._id });
    statistic.user.active = await Account.countDocuments({ role_id: userRole._id, status: 'active' });
    statistic.user.inactive = await Account.countDocuments({ role_id: userRole._id, status: 'inactive' });
    //count account not user
    statistic.account.total = await Account.countDocuments({ role_id: { $not: { $gt: userRole._id } } });
    statistic.account.active = await Account.countDocuments({ role_id: { $not: { $gt: userRole._id } }, status: 'active' });
    statistic.account.inactive = await Account.countDocuments({ role_id: { $not: { $gt: userRole._id } }, status: 'inactive' });

    res.render('admin/pages/dashboard/index', {
        pageTitle: 'Trang tổng quan',
        statistic: statistic
    });
}