const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const { ADMIN_PATH } = require('./../../config/system');
const PATH_ADMIN = `/${ADMIN_PATH}`;
module.exports = (app) => {

    app.use(PATH_ADMIN + "/dashboard", dashboardRoute);

    app.use(PATH_ADMIN + "/products", productRoute);

    app.use(PATH_ADMIN + "/product-category", productCategoryRoute);

    app.use(PATH_ADMIN + "/roles", roleRoute);

    app.use(PATH_ADMIN + "/accounts", accountRoute);

}