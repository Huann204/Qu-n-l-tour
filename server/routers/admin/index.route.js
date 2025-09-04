const router = require("express").Router();
const accountRoutes = require("./account.route");
const settingRoutes = require("./setting.route");

router.use('/account', accountRoutes);
router.use('/setting', settingRoutes);

module.exports = router;