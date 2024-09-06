const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/own-account.controller.js');

router.get('/', controller.index);

module.exports = router;