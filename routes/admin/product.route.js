const express = require("express");
const router = express.Router();
const productController = require("../../controllers/admin/product.controller");
const multer = require("multer");
const path = require('path')
const storageMulter = require("../../helpers/storageMulter");
const validation = require("../../validates/admin/product.validate");
const upload = multer();

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './public/uploads');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage: storage });

router.get("/", productController.index);

router.patch("/change-status/:status/:id", productController.changeStatus);

router.patch("/change-multi", productController.changeMulti);

router.get("/create", productController.create);

router.post("/create", upload.single('thumbnail'), validation.createProduct, productController.createProduct);

router.get("/edit/:id", productController.edit);

router.put("/edit/:id", upload.single('thumbnail'), validation.editProduct, productController.editProduct);

router.get("/detail/:id", productController.detail);

router.delete("/delete/:id", productController.delete);

module.exports = router;