const router = require("express").Router();
const accountRoutes = require("./account.route");
const categoryRoutes = require("./category.route");
const settingRoutes = require("./setting.route");
const tourRoutes = require("./tour.route");
const categoryBlogRoutes = require("./category-blog.route");
const blogRoutes = require("./blog.route");
const contactRoutes = require("./contact.route");
const uploadRoutes = require("./upload.route");
const orderRoutes = require("./order.route");
const dashboardRoutes = require("./dashboard.route");
<<<<<<< HEAD
const profileRoutes = require("./profile.route");

=======
>>>>>>> b45375d589e92f3c78a3f721b4bc54cc694d8737


const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.use('/account', accountRoutes);
router.use('/dashboard', authMiddleware.verifyToken, dashboardRoutes);
router.use('/category',authMiddleware.verifyToken, categoryRoutes);
router.use('/setting',authMiddleware.verifyToken, settingRoutes);
router.use('/tour',authMiddleware.verifyToken, tourRoutes);
router.use('/category-blog',authMiddleware.verifyToken, categoryBlogRoutes);
router.use('/blog',authMiddleware.verifyToken, blogRoutes);
router.use('/contact',authMiddleware.verifyToken, contactRoutes);
router.use('/upload',authMiddleware.verifyToken, uploadRoutes)
router.use('/order',authMiddleware.verifyToken, orderRoutes);
router.use('/profile',authMiddleware.verifyToken, profileRoutes);



module.exports = router;