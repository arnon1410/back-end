const express = require("express");
const { 
    fnGetFileDocPDF,
    fnDownloadFileDocPDF,
    fnSetFileDocPDF 
} = require("../controllers/fileControllers");

const router = express.Router();

router.post("/fnGetFileDocPDF", fnGetFileDocPDF);
router.post("/fnSetFileDocPDF", fnSetFileDocPDF);

router.get("/fnDownloadFileDocPDF", fnDownloadFileDocPDF);

module.exports = router;