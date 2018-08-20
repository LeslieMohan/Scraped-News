var router = require("express").Router();
var fetchRoutes = require("./fetch");
var commentRoutes = require("./comment");
var headlineRoutes = require("./headlines");

router.use("/fetch", fetchRoutes);
router.use("/comment", commentRoutes);
router.use("/headlines", headlineRoutes);

module.exports = router;
