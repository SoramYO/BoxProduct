const uploadFileToFirebase = require('../../helpers/firebaseUpload');
const ProductCategory = require('../../models/product-category.model')
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/createTree');
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const sortHelper = require("../../helpers/sort");
const panigationHelper = require("../../helpers/pagination");
const Account = require('../../models/account.model');
//[GET] /admin/product-category
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);
    const { keyword, keywordRegex } = searchHelper(req.query);
    let find = {
        deleted: false,
    };
    if (req.query.keyword) {
        find.title = keywordRegex;
    }
    if (req.query.status) {
        find.status = req.query.status
    }
    const countProductsCategory = await ProductCategory.countDocuments(find);

    const pagination = await panigationHelper(req.query, countProductsCategory);

    const sort = await sortHelper(req.query);

    const productCategory = await ProductCategory.find(find).skip(pagination.skip).limit(pagination.limit).sort(sort);
    for (const category of productCategory) {
        const account = await Account.findById(_id = category.createBy.account_id);
        if (account) {
            category.createBy.fullName = account.fullName;
        }
    }
    for (const category of productCategory) {
        const account = await Account.findById(_id = category.updateBy.account_id);
        if (account) {
            category.updateBy.fullName = account.fullName;
        }
    }
    const newProductCategory = createTree(productCategory);
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh sách danh mục sản phẩm",
        productCategory: newProductCategory,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: pagination
    });
}

//[GET] /admin/product-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };

    const productCategory = await ProductCategory.find(find).sort({ position: 'asc' });

    const newProductCategory = createTree(productCategory);

    res.render("admin/pages/product-category/create", {
        pageTitle: "Thêm danh mục sản phẩm",
        productCategory: newProductCategory
    });
}

//[POST] /admin/product-category/create
module.exports.createCategory = async (req, res) => {
    try {
        const countProductsCategory = await ProductCategory.countDocuments();
        let thumbnailUrl = null;
        if (req.file) {
            thumbnailUrl = await uploadFileToFirebase(req.file);
        }

        const productCategory = new ProductCategory({
            title: req.body.title,
            parent_id: req.body.parent_id,
            description: req.body.description,
            thumbnail: req.file ? thumbnailUrl : req.body.thumbnail,
            status: req.body.status,
            position: req.body.position ? parseInt(req.body.position) : countProductsCategory + 1,
            createBy: {
                account_id: res.locals.user._id,
                createAt: Date.now()
            },
        });

        await productCategory.save();


        req.flash('success', `Thêm danh mục ${productCategory.title} thành công`);
        res.redirect(`/${systemConfig.ADMIN_PATH}/product-category`);
    } catch (error) {
        console.error('Lỗi khi thêm danh mục sản phẩm:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi thêm danh mục sản phẩm', error.message);
        res.redirect('back');
    }
}

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
    const id = req.params.id;

    const category = await ProductCategory.findOne({
        _id: id,
        deleted: false
    });


    const categories = await ProductCategory.find({
        deleted: false
    });

    const categoryTree = createTree(categories);

    res.render("admin/pages/product-category/edit", {
        pageTitle: "Chỉnh sửa danh mục sản phẩm",
        productCategory: category,
        category: categoryTree
    });
}

// [PUT] /admin/product-category/edit/:id
module.exports.editCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await ProductCategory.findOne({ _id: id, deleted: false });

        let thumbnailUrl = null;
        if (req.file) {
            thumbnailUrl = await uploadFileToFirebase(req.file);
        }
        category.title = req.body.title;
        category.description = req.body.description;
        category.thumbnail = req.file ? thumbnailUrl : req.body.thumbnail;
        category.status = req.body.status;
        category.position = req.body.position ? parseInt(req.body.position) : 0;
        category.parent_id = req.body.parent_id;
        category.updateBy = {
            account_id: res.locals.user._id,
            updateAt: Date.now()
        };

        await category.save();

        req.flash("success", "Cập nhật danh mục thành công!");
        res.redirect(`/${systemConfig.ADMIN_PATH}/product-category`);
    } catch (error) {
        console.error('Lỗi khi chỉnh sửa danh mục sản phẩm:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi chỉnh sửa danh mục sản phẩm');
        res.redirect('back');
    }
}

// [DELETE] /admin/product-category/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const category = await ProductCategory.findByIdAndUpdate({ _id: id }, { deleted: true, deletedAt: Date.now(), deletedBy: { account_id: res.locals.user._id } });
    req.flash('success', `Xóa danh mục ${category.title} thành công`);
    res.redirect(`/${systemConfig.ADMIN_PATH}/product-category`);

}
//[PATCH] /admin/product-category/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const ids = req.body.ids.split(', ');
        const status = req.body.type;
        if (status === 'delete-all') {
            await ProductCategory.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: Date.now(), deletedBy: { account_id: res.locals.user._id } });
            req.flash('success', 'Xóa danh mục sản phẩm thành công');
            return res.redirect('back');
        } else if (status === 'change-position') {
            for (let i = 0; i < ids.length; i++) {
                const id = ids[i].split('-')[0];
                const position = parseInt(ids[i].split('-')[1]);
                await ProductCategory.findByIdAndUpdate({ _id: id }, { position: position, updateBy: { account_id: res.locals.user._id, updateAt: Date.now() } });
            }
            req.flash('success', 'Cập nhật vị trí thành công');
            return res.redirect('back');
        }

        await ProductCategory.updateMany({ _id: { $in: ids } }, { status: status, updateBy: { account_id: res.locals.user._id, updateAt: Date.now() } });
        req.flash('success', 'Cập nhật trạng thái thành công');
        return res.redirect('back');
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái danh mục sản phẩm:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái danh mục sản phẩm');
        res.redirect('back');
    }
}

//[PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.params.status;
        await ProductCategory.findByIdAndUpdate({ _id: id }, { status: status, updateBy: { account_id: res.locals.user._id, updateAt: Date.now() } });
        req.flash('success', 'Cập nhật trạng thái thành công');
        return res.redirect('back');
    }
    catch (error) {
        console.error('Lỗi khi cập nhật trạng thái danh mục sản phẩm:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi cập nhật trạng thái danh mục sản phẩm');
        res.redirect('back');
    }
}