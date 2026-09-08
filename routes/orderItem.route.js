const express = require("express");
const router = express.Router();
const controller = require("../controllers/orderItem.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getbyID);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
