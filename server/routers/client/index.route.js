const router = require("express").Router();
const tourRoutes = require("./tour.route");
const homeRoutes = require("./home.route");
const cartRoutes = require("./cart.route");
const contactRoutes = require("./contact.route");
const categoryRoutes = require("./category.route");

const settingMiddleware = require("../../middlewares/client/setting.middleware");
const categoryMiddleware = require("../../middlewares/client/category.middleware");

router.use(settingMiddleware.WebisteInfo);
router.use(categoryMiddleware.list);

router.use('/', homeRoutes);
router.use('/tours', tourRoutes);
router.use('/cart', cartRoutes);
router.use('/contact', contactRoutes);
router.use('/category', categoryRoutes);

module.exports = router;