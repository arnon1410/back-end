const express = require("express");
const { fnSetFormPK4, fnSetSignaturePK4, fnSetAssessorPK4 } = require("../controllers/setPK4Controllers");

const router = express.Router();

router.post("/fnSetFormPK4", fnSetFormPK4);
router.post("/fnSetSignaturePK4", fnSetSignaturePK4);
router.post("/fnSetAssessorPK4", fnSetAssessorPK4);


module.exports = router;