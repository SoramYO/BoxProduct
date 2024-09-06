const express = require("express");
const router = express.Router();
const multer = require("multer");
const validate = require("../../validates/admin/auth.validate.js");

const upload = multer();

const controller = require("../../controllers/admin/auth.controller.js");

router.get("/login", controller.login);

router.post("/login", validate.postLogin, controller.loginCheck);

router.get("/logout", controller.logout);



module.exports = router;