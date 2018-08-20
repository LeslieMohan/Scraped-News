var router = require("express").Router();
var commentController = require("../../controllers/comment");

router.get("/:id", commentController.findOne);
router.post("/", commentController.create);
router.delete("/:id", commentController.delete);

module.exports = router;