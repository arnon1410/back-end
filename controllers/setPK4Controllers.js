const {
    fnUpdateFormPK4SQL,
    fnUpdateConPK4SQL,
    fnUpdateStatusDocPK4SQL,
    fnUpdateDataAssessorPK4SQL,
    fnInsertDataAssessorPK4SQL,
    fnUpdateDataSignaturePK4SQL,
    fnInsertDataSignaturePK4SQL,  
    
} = require("../utils/sqlPK4");

const fnSetFormPK4 = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormPK4");

        let updateSuccess = true;

        for (const data of dataArray) {
            let result;

            if (data.idPK4) {
                result = await fnUpdateFormPK4SQL(data);
            } else if (data.idConPK4) {
                result = await fnUpdateConPK4SQL(data);
            } else {
                // กรณีไม่มีทั้ง idPK4 และ idConPK4
                updateSuccess = false;
                break;
            }

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocPK4SQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignaturePK4 = async (req, res) => {  
    const { userId, username, signPath, idConPK4 } = req.body;

    const data = {
        userId,
        username,
        signPath,
        idConPK4
    };
    
  
    if (!userId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignaturePK4");
    let resultSetSignature = ''

        if (idConPK4) {
            resultSetSignature = await fnUpdateDataSignaturePK4SQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignaturePK4SQL(data);
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

const fnSetAssessorPK4 = async (req, res) => {  
    const { userId, username, prefixAsessor, position, dateAsessor, idConPK4 } = req.body;

    const data = {
        userId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConPK4
    };
    
  
    if (!userId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorPK4");
    let resultSetAssessor = ''

        if (idConPK4) {
            resultSetAssessor = await fnUpdateDataAssessorPK4SQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorPK4SQL(data);
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
    fnSetFormPK4,
    fnSetSignaturePK4,
    fnSetAssessorPK4
};
   