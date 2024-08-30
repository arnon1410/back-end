const express = require("express");
const { fnSetSideNameASM, fnSetFormAssessment, fnSetSignatureASM, fnSetAssessorASM } = require("../controllers/setAssessmentControllers");

const router = express.Router();

router.post("/fnSetSideNameASM", fnSetSideNameASM);
router.post("/fnSetFormAssessment", fnSetFormAssessment);
router.post("/fnSetSignatureASM", fnSetSignatureASM);
router.post("/fnSetAssessorASM", fnSetAssessorASM);


module.exports = router;