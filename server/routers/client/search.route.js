const router = require("express").Router();

const searchController = require("../../controllers/client/search.controller");

router.get("/", searchController.list);

module.exports = router;
