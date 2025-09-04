const router = require("express").Router();
const homeRoutes = require("./home.route");

router.use('/', homeRoutes);

module.exports = router;