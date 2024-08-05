const express = require("express");
const { fnGetUserControl } = require("../controllers/userControllers");

const router = express.Router();

router.post("/fnGetUserControl", fnGetUserControl);

module.exports = router;