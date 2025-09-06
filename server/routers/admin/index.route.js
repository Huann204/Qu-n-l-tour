const router = require("express").Router();
const accountRoutes = require("./account.route");
const categoryRoutes = require("./category.route");
const settingRoutes = require("./setting.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

router.use('/account', accountRoutes);
router.use('/category',authMiddleware.verifyToken, categoryRoutes);
router.use('/setting',authMiddleware.verifyToken, settingRoutes)

module.exports = router;