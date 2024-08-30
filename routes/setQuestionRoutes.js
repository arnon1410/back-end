const express = require("express");
const { fnSetFormQuestion, fnSetQuestionOther, fnSetSignatureQR, fnSetAssessorQR} = require("../controllers/setQuestionControllers");

const router = express.Router();

router.post("/fnSetFormQuestion", fnSetFormQuestion);
router.post("/fnSetQuestionOther", fnSetQuestionOther);
router.post("/fnSetSignatureQR", fnSetSignatureQR);
router.post("/fnSetAssessorQR", fnSetAssessorQR);

module.exports = router;