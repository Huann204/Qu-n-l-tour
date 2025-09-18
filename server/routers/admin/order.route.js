const router = require('express').Router();

const orderController = require("../../controllers/admin/order.controller");

router.get('/list', orderController.list)

module.exports = router;
