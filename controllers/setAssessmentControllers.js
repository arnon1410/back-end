const {
    fnUpdateDataNameUnitASMSQL,
    fnInsertDataNameUnitASMSQL,
    fnUpdateFormAssessmentSQL,
    fnUpdateConAssessmentSQL,
    fnInsertConAssessmentSQL,
    fnUpdateStatusDocASMSQL,
    fnUpdateDataAssessorASMSQL,
    fnInsertDataAssessorASMSQL,
    fnUpdateDataSignatureASMSQL,
    fnInsertDataSignatureASMSQL,
    
} = require("../utils/sqlAssessment");

const fnSetSideNameASM = async (req, res) => {  
    const { userDocId, sideId, username, nameUnit, idConASM } = req.body;

    const data = {
        userDocId,
        sideId,
        username,
        nameUnit,
        idConASM
    };
  
    if (!userDocId || !sideId || !username) {
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

        let resultVal = 'success';  // เริ่มต้นค่าเป็น 'success' โดยค่า default

        for (const data of dataArray) {
            let result;

            if (data.idASM) {
                result = await fnUpdateFormAssessmentSQL(data);
            } else if (data.idConASM && data.descResultConASM) {
                result = await fnUpdateConAssessmentSQL(data);
            } else if (!data.idConASM && data.descResultConASM) {
                result = await fnInsertConAssessmentSQL(data);
            } else {
                // กรณีไม่มีทั้ง idASM และ idConASM
                updateSuccess = false;
                break;
            }

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }

            // ตรวจสอบเงื่อนไขและเก็บค่า resultVal ทันทีในลูปแรก
            if (!data.idConASM && data.descResultConASM) {
                resultVal = result;  // เก็บค่าผลลัพธ์และออกจากลูป
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocASMSQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');

            // ส่งค่า resultVal ซึ่งอัปเดตในลูปแรกแล้ว
            res.status(200).json({ result: resultVal });

        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignatureASM = async (req, res) => {  
    const { userDocId, username, signPath, idConASM } = req.body;

    const data = {
        userDocId,
        username,
        signPath,
        idConASM
    };
    
  
    if (!userDocId || !username || !signPath) {
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
                res.status(200).json({ result: resultSetSignature });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        }

    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetAssessorASM = async (req, res) => {  
    const { userDocId, username, prefixAsessor, position, dateAsessor, idConASM } = req.body;

    const data = {
        userDocId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConASM
    };
    
  
    if (!userDocId || !username || !prefixAsessor || !position || !dateAsessor) {
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
                res.status(200).json({ result: resultSetAssessor });
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
   