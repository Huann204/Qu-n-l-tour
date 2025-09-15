const router = require('express').Router();

const categoryBlogController = require("../../controllers/admin/category-blog.controller");

router.get('/list', categoryBlogController.list);

router.get('/create', categoryBlogController.create);

module.exports = router;
