const router = require("express").Router();

const categoryBlogController = require("../../controllers/client/category-blog.controller");

router.get('/', categoryBlogController.list);

module.exports = router;
