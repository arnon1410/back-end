const express = require("express");
const { 
    fnSetSignaturePFM,
    fnSetAssessorPFM, 
    fnSetSideNamePFM, 
    fnSetFormPerformance,
    fnSetChanceRiskModal,
    fnSetEffectRiskModal
} = require("../controllers/setPerformanceControllors");

const router = express.Router();

router.post("/fnSetSideNamePFM", fnSetSideNamePFM);
router.post("/fnSetSignaturePFM", fnSetSignaturePFM);
router.post("/fnSetAssessorPFM", fnSetAssessorPFM);
router.post("/fnSetFormPerformance", fnSetFormPerformance);
router.post("/fnSetChanceRiskModal", fnSetChanceRiskModal);
router.post("/fnSetEffectRiskModal", fnSetEffectRiskModal);
// router.post("/fnSetRankRiskModal", fnSetRankRiskModal);


module.exports = router;