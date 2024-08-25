const Product = require("../../models/product.model");
const Image = require("../../models/product.image.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const panigationHelper = require("../../helpers/pagination");
const systemConfig = require('../../config/system')
const fs = require('fs');
const path = require('path');

//[GET] /admin/products
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
  const countProducts = await Product.countDocuments(find);

  const pagination = await panigationHelper(req.query, countProducts);

  const products = await Product.find(find).skip(pagination.skip).limit(pagination.limit).sort({ position: "desc" }).populate('thumbnail');

  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword,
    pagination: pagination,
  });
};

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  const product = await Product.findByIdAndUpdate({ _id: id }, { status: status });
  req.flash('success', `Cập nhật trạng thái ${product.title} thành công`);
  res.redirect('back');
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const ids = req.body.ids.split(', ');
  const status = req.body.type;
  if (status === 'delete-all') {
    await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: Date.now() });
    req.flash('success', `Xóa thành công ${ids.length} sản phẩm`);
    return res.redirect('back');
  } else if (status === 'change-position') {
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i].split('-')[0];
      const position = parseInt(ids[i].split('-')[1]);
      await Product.findByIdAndUpdate({ _id: id }, { position: position });
    }
    req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm`);
    return res.redirect('back');
  }
  await Product.updateMany({ _id: { $in: ids } }, { status: status });
  req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm`);
  return res.redirect('back');

}
//[GET] /admin/products/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm sản phẩm",
  });
}

//[POST] /admin/products/create
module.exports.createProduct = async (req, res) => {

  // Tạo đối tượng Image và lưu vào cơ sở dữ liệu
  // const imageObj = {
  //   name: req.body.title,
  //   img: {
  //     data: fs.readFileSync(path.join(__dirname, '../../public/uploads/' + req.file.filename)),
  //     contentType: req.file.mimetype
  //   }
  // };
  // const image = await Image.create(imageObj);

  const countProducts = await Product.countDocuments();


  const product = new Product({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price ? parseInt(req.body.price) : 0,
    discountPercentage: req.body.discountPercentage ? parseInt(req.body.discountPercentage) : 0,
    stock: req.body.stock ? parseInt(req.body.stock) : 0,
    //thumbnail: image._id,
    thumbnail: req.body.thumbnail,
    status: req.body.status,
    position: req.body.position ? parseInt(req.body.position) : countProducts + 1,
  });
  await product.save();



  req.flash('success', `Thêm sản phẩm ${product.title} thành công`);
  res.redirect(`/${systemConfig.ADMIN_PATH}/products`);
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
    });
  } catch (err) {
    console.log('Error at get edit product', err);
    res.redirect(`/${systemConfig.ADMIN_PATH}/products`);
  }
}

//[PUT] /admin/products/edit/:id
module.exports.editProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price ? parseInt(req.body.price) : 0;
  product.discountPercentage = req.body.discountPercentage ? parseInt(req.body.discountPercentage) : 0;
  product.stock = req.body.stock ? parseInt(req.body.stock) : 0;
  product.thumbnail = req.body.thumbnail;
  product.status = req.body.status;
  product.position = req.body.position ? parseInt(req.body.position) : 0;

  await product.save();
  req.flash('success', `Chỉnh sửa sản phẩm ${product.title} thành công`);
  res.redirect(`/${systemConfig.ADMIN_PATH}/products`);
}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).populate('thumbnail');
  res.render("admin/pages/products/detail", {
    pageTitle: "Chi tiết sản phẩm",
    product: product,
  });
}

//[DELETE] /admin/products/delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate({ _id: id }, { deleted: true, deletedAt: Date.now() });
  await Product.deleteOne({ _id: id });
  req.flash('success', `Xóa sản phẩm ${product.title} thành công`);
  res.redirect('back');
}