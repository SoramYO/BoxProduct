const uploadFileToFirebase = require('../../helpers/firebaseUpload');
const ProductCategory = require('../../models/product-category.model')
const systemConfig = require('../../config/system');
const createTree = require('../../helpers/createTree');
//[GET] /admin/product-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };
    const productCategory = await ProductCategory.find(find).sort({ position: 'asc' });
    const newProductCategory = createTree(productCategory);
    res.render("admin/pages/product-category/index", {
        pageTitle: "Danh sách danh mục sản phẩm",
        productCategory: newProductCategory,
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
            position: req.body.position ? parseInt(req.body.position) : countProductsCategory + 1
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

// [GET] /admin/products-category/edit/:id
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

// [PUT] /admin/products-category/edit/:id
module.exports.editCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const category = await ProductCategory.findOne({_id: id, deleted: false});

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

        await category.save();

        req.flash("success", "Cập nhật danh mục thành công!");
        res.redirect(`/${systemConfig.ADMIN_PATH}/product-category`);
    } catch (error) {
        console.error('Lỗi khi chỉnh sửa danh mục sản phẩm:', error.message);
        req.flash('error', 'Có lỗi xảy ra khi chỉnh sửa danh mục sản phẩm');
        res.redirect('back');
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    const category = await ProductCategory.findByIdAndUpdate({ _id: id }, { deleted: true, deletedAt: Date.now() });
    await ProductCategory.deleteOne({ _id: id });
    req.flash('success', `Xóa danh mục ${category.title} thành công`);
    res.redirect(`/${systemConfig.ADMIN_PATH}/product-category`);

}