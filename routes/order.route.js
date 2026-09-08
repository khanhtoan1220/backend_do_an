const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");

router.post("/", controller.post);
router.get("/", controller.getAll);
router.get("/:id", controller.getbyID);
router.patch("/:id/status", controller.updateStatus);

module.exports = router;
