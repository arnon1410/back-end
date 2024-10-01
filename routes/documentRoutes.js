const express = require("express");
const { 
    fnGetResultDoc,
    fnGetResultDocCondition,
    fnGetResultQR, 
    fnGetResultEndQR ,
    fnGetResultOtherQR,
    fnGetResultConQR, 
    fnGetResultASM, 
    fnGetResultConASM,
    fnGetResultPFMEV,
    fnGetResultConPFMEV,
    fnGetResultChanceRisk,
    fnGetResultEffectRisk,
    fnGetResultPK4,
    fnGetResultConPK4,
    fnGetResultConPK5,
    fnGetResultHighRisk,
    fnGetResultImprovePK4,
    fnGetResultPK5Fix,
    fnGetResultConPKF5,

    fnGetResultCaseRisk,

    fnUpdateCommentForAdmin

} = require("../controllers/documentControllers");
const router = express.Router();

// router ดึงค่าสถานะ เอกสารของแต่ละด้าน
router.post("/fnGetResultDoc", fnGetResultDoc);
router.post("/fnGetResultDocCondition", fnGetResultDocCondition);
router.post("/fnGetResultQR", fnGetResultQR);
router.post("/fnGetResultEndQR", fnGetResultEndQR);
router.post("/fnGetResultOtherQR", fnGetResultOtherQR);
router.post("/fnGetResultConQR", fnGetResultConQR);

router.post("/fnGetResultASM", fnGetResultASM);
router.post("/fnGetResultConASM", fnGetResultConASM);
router.post("/fnGetResultCaseRisk", fnGetResultCaseRisk);

router.post("/fnGetResultPFMEV", fnGetResultPFMEV);
router.post("/fnGetResultConPFMEV", fnGetResultConPFMEV);
router.post("/fnGetResultChanceRisk", fnGetResultChanceRisk);
router.post("/fnGetResultEffectRisk", fnGetResultEffectRisk);
router.post("/fnGetResultPK4", fnGetResultPK4);
router.post("/fnGetResultConPK4", fnGetResultConPK4);
router.post("/fnGetResultHighRisk", fnGetResultHighRisk)
router.post("/fnGetResultImprovePK4", fnGetResultImprovePK4)
router.post("/fnGetResultPK5Fix", fnGetResultPK5Fix);
router.post("/fnGetResultConPK5", fnGetResultConPK5);
router.post("/fnGetResultConPKF5", fnGetResultConPKF5);


router.post("/fnUpdateCommentForAdmin", fnUpdateCommentForAdmin);


module.exports = router;