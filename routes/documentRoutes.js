const express = require("express");
const { fnGetResultDoc,fnGetResultQR } = require("../controllers/documentControllers");
const router = express.Router();

// router ดึงค่าสถานะ เอกสารของแต่ละด้าน
router.post("/fnGetResultDoc", fnGetResultDoc);
router.post("/fnGetResultQR", fnGetResultQR)

module.exports = router;