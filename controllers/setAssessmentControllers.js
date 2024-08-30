const {
    fnUpdateDataNameUnitASMSQL,
    fnInsertDataNameUnitASMSQL,
    fnUpdateFormAssessmentSQL,
    fnUpdateConAssessmentSQL,
    fnUpdateStatusDocASMSQL,
    fnUpdateDataAssessorASMSQL,
    fnInsertDataAssessorASMSQL,
    fnUpdateDataSignatureASMSQL,
    fnInsertDataSignatureASMSQL,
    
} = require("../utils/sqlAssessment");

const fnSetSideNameASM = async (req, res) => {  
    const { userId, sideId, username, nameUnit, idConASM } = req.body;

    const data = {
        userId,
        sideId,
        username,
        nameUnit,
        idConASM
    };
  
    if (!userId || !sideId || !username) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSideNameASM");
    let resultSetNameUnit = ''

    if (idConASM) {
        resultSetNameUnit = await fnUpdateDataNameUnitASMSQL(data);
        if (resultSetNameUnit) {
            res.status(200).json({ result: 'success' });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } else {
        resultSetNameUnit = await fnInsertDataNameUnitASMSQL(data);
        if (resultSetNameUnit) {
            res.status(200).json({ result: 'success' });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    }
        

    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetFormAssessment = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormAssessment");

        let updateSuccess = true;

        for (const data of dataArray) {
            let result;

            if (data.idASM) {
                result = await fnUpdateFormAssessmentSQL(data);
            } else if (data.idConASM) {
                result = await fnUpdateConAssessmentSQL(data);
            } else {
                // กรณีไม่มีทั้ง idASM และ idConASM
                updateSuccess = false;
                break;
            }

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocASMSQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignatureASM = async (req, res) => {  
    const { userId, username, signPath, idConASM } = req.body;

    const data = {
        userId,
        username,
        signPath,
        idConASM
    };
    
  
    if (!userId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignatureASM");
    let resultSetSignature = ''

        if (idConASM) {
            resultSetSignature = await fnUpdateDataSignatureASMSQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignatureASMSQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        }

    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetAssessorASM = async (req, res) => {  
    const { userId, username, prefixAsessor, position, dateAsessor, idConASM } = req.body;

    const data = {
        userId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConASM
    };
    
  
    if (!userId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorASM");
    let resultSetAssessor = ''

        if (idConASM) {
            resultSetAssessor = await fnUpdateDataAssessorASMSQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorASMSQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        }

    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};
module.exports = {
    fnSetSideNameASM,
    fnSetFormAssessment,
    fnSetSignatureASM,
    fnSetAssessorASM
};
   