const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
router.post("/", controller.post);

router.get("/", controller.getAll);
router.put("/:id", controller.update);

router.delete("/:id", controller.delete);

router.get("/:id", controller.getbyID);

module.exports = router;
