const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller.js");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createRole);

router.get("/edit/:id", controller.edit);

router.put("/edit/:id", controller.update);

router.get("/permissions", controller.permissions);

router.put("/permissions", controller.permissionsPatch);

module.exports = router;