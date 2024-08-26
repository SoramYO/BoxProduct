const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./products-category.route");
const { ADMIN_PATH } = require('./../../config/system');
const PATH_ADMIN = `/${ADMIN_PATH}`;
module.exports = (app) => {

    app.use(PATH_ADMIN + "/dashboard", dashboardRoute);

    app.use(PATH_ADMIN + "/products", productRoute);

    app.use(PATH_ADMIN + "/products-category", productCategoryRoute);


}