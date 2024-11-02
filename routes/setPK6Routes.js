const express = require("express");
const { fnSetFormPK6, fnSetSignaturePK6, fnSetAssessorPK6 } = require("../controllers/setPK6Controllers");

const router = express.Router();

router.post("/fnSetFormPK6", fnSetFormPK6);
router.post("/fnSetSignaturePK6", fnSetSignaturePK6);
router.post("/fnSetAssessorPK6", fnSetAssessorPK6);


module.exports = router;