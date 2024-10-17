const express = require("express");
const { 
    fnGetQRFileDocPDF,
    fnDownloadFileDocPDF,
    fnSetQRFileDocPDF,

    fnGetCollationFileDocPDF,
    fnSetCollationFileDocPDF 
} = require("../controllers/fileControllers");

const router = express.Router();

router.post("/fnGetQRFileDocPDF", fnGetQRFileDocPDF);
router.post("/fnSetQRFileDocPDF", fnSetQRFileDocPDF);

router.get("/fnDownloadFileDocPDF", fnDownloadFileDocPDF);

router.post("/fnGetCollationFileDocPDF", fnGetCollationFileDocPDF);
router.post("/fnSetCollationFileDocPDF", fnSetCollationFileDocPDF);

module.exports = router;