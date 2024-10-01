const express = require("express");
const { fnSetFormPKF5, fnSetSignaturePKF5, fnSetAssessorPKF5, fnInsertFormPKF5Fix, fnUpdateFormPKF5Fix} = require("../controllers/setPKF5Controllers");

const router = express.Router();

router.post("/fnSetFormPKF5", fnSetFormPKF5);
router.post("/fnSetSignaturePKF5", fnSetSignaturePKF5);
router.post("/fnSetAssessorPKF5", fnSetAssessorPKF5);
router.post("/fnInsertFormPKF5Fix", fnInsertFormPKF5Fix);
router.post("/fnUpdateFormPKF5Fix", fnUpdateFormPKF5Fix);




module.exports = router;