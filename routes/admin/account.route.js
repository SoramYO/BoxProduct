const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/account.validate.js");

const upload = multer();


const controller = require("../../controllers/admin/account.controller.js");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single('avatar'), validate.createAccount, controller.createAccount);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", upload.single('avatar'), validate.updateAccount, controller.update);

router.delete("/delete/:id", controller.delete);

module.exports = router;