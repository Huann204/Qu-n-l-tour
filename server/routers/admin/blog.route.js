const router = require('express').Router();

const blogController = require("../../controllers/admin/blog.controller");

router.get('/list', blogController.list);

router.get('/create', blogController.create);

router.get('/trash', blogController.trash);

module.exports = router;
