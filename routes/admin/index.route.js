const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const middleware = require("../../middlewares/auth.middleware.js");
const { ADMIN_PATH } = require('./../../config/system');
const PATH_ADMIN = `/${ADMIN_PATH}`;
module.exports = (app) => {

    app.use(PATH_ADMIN + "/dashboard", middleware.requireAuth, dashboardRoute);

    app.use(PATH_ADMIN + "/products", middleware.requireAuth, productRoute);

    app.use(PATH_ADMIN + "/product-category", middleware.requireAuth, productCategoryRoute);

    app.use(PATH_ADMIN + "/roles", middleware.requireAuth, roleRoute);

    app.use(PATH_ADMIN + "/accounts", middleware.requireAuth, accountRoute);

    app.use(PATH_ADMIN + "/auth", authRoute)

}