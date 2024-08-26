const express = require("express");
const router = express.Router();
const productCategoryController = require("../../controllers/admin/product-category.controller");


router.get("/", productCategoryController.index);


module.exports = router;