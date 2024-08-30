const express = require("express");
const multer = require("multer");


const productCategoryController = require("../../controllers/admin/product-category.controller.js");
const validation = require("../../validates/admin/product-category.validate.js");
const upload = multer();
const router = express.Router();
router.get("/", productCategoryController.index);

router.get("/create", productCategoryController.create);

router.post("/create", upload.single('thumbnail'), validation.createProduct, productCategoryController.createCategory);

router.get("/edit/:id", productCategoryController.edit);

router.put("/edit/:id", upload.single('thumbnail'), validation.editProduct, productCategoryController.editCategory);

router.delete("/delete/:id", productCategoryController.delete);


module.exports = router;