const Product = require("../../models/product.model");
//[GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });


  // products.forEach((item) => {
  //   item.discountPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
  // });

  const newProducts = products.map((item) => {
    item.discountPrice = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
    return item;
  });

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

//[GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    status: "active",
    deleted: false,
  });
  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product: product,
  });
};