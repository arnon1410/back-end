const express = require("express");
const { fnSetFormPK5, fnSetSignaturePK5, fnSetAssessorPK5 } = require("../controllers/setPK5Controllers");

const router = express.Router();

router.post("/fnSetFormPK5", fnSetFormPK5);
router.post("/fnSetSignaturePK5", fnSetSignaturePK5);
router.post("/fnSetAssessorPK5", fnSetAssessorPK5);


module.exports = router;