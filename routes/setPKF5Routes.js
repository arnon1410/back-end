const express = require("express");
const { fnSetFormPKF5, fnSetSignaturePKF5, fnSetAssessorPKF5 } = require("../controllers/setPKF5Controllers");

const router = express.Router();

router.post("/fnSetFormPKF5", fnSetFormPKF5);
router.post("/fnSetSignaturePKF5", fnSetSignaturePKF5);
router.post("/fnSetAssessorPKF5", fnSetAssessorPKF5);


module.exports = router;