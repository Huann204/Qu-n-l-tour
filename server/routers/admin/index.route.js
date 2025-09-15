const router = require("express").Router();
const accountRoutes = require("./account.route");
const categoryRoutes = require("./category.route");
const settingRoutes = require("./setting.route");
const tourRoutes = require("./tour.route");
const categoryBlogRoutes = require("./category-blog.route");
const blogRoutes = require("./blog.route");


const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.use('/account', accountRoutes);
router.use('/category',authMiddleware.verifyToken, categoryRoutes);
router.use('/setting',authMiddleware.verifyToken, settingRoutes);
router.use('/tour',authMiddleware.verifyToken, tourRoutes);
router.use('/category-blog',authMiddleware.verifyToken, categoryBlogRoutes);
router.use('/blog',authMiddleware.verifyToken, blogRoutes);


module.exports = router;