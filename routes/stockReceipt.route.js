const express = require("express");
const router = express.Router();
const controller = require("../controllers/stockReceipt.controller");

router.post("/", controller.post);
router.get("/", controller.getAll);

module.exports = router;
