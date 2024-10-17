const {
    fnUpdateFormPKF5SQL,
    fnUpdateConPKF5SQL,
    fnUpdateStatusDocPKF5SQL,
    fnUpdateDataAssessorPKF5SQL,
    fnInsertDataAssessorPKF5SQL,
    fnUpdateDataSignaturePKF5SQL,
    fnInsertDataSignaturePKF5SQL,
    
    fnInsertFormPKF5FixSQL,
    fnUpdateFormPKF5FixSQL
    
} = require("../utils/sqlPKF5");



const fnSetFormPKF5 = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormPKF5");

        let updateSuccess = true;

        for (const data of dataArray) {
            const result = await fnUpdateFormPKF5SQL(data);

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocPKF5SQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignaturePKF5 = async (req, res) => {  
    const { userDocId, username, signPath, idConPKF5 } = req.body;

    const data = {
        userDocId,
        username,
        signPath,
        idConPKF5
    };
    
  
    if (!userDocId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignaturePKF5");
    let resultSetSignature = ''

        if (idConPKF5) {
            resultSetSignature = await fnUpdateDataSignaturePKF5SQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignaturePKF5SQL(data);
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

const fnSetAssessorPKF5 = async (req, res) => {  
    const { userDocId, username, prefixAsessor, position, dateAsessor, idConPKF5 } = req.body;

    const data = {
        userDocId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConPKF5
    };
    
  
    if (!userDocId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorPKF5");
    let resultSetAssessor = ''

        if (idConPKF5) {
            resultSetAssessor = await fnUpdateDataAssessorPKF5SQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorPKF5SQL(data);
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

const fnInsertFormPKF5Fix = async (req, res) => {  
    const { userId, sideId, username, headRisk, objRisk, risking, improvement, agentcy, progress, solution, idPKF5Fix } = req.body;

    const data = {
        userId,
        sideId,
        username,
        headRisk,
        objRisk,
        risking,
        improvement,
        agentcy,
        progress,
        solution,
        idPKF5Fix
    };

    if (!userId || !sideId || !username || !headRisk || !improvement || !agentcy || !progress || !solution) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    
    try {
        console.log("/api/documents/fnInsertFormPKF5FixSQL");

        // เรียกใช้ฟังก์ชันเพื่อ insert ข้อมูล
        var resultSetPKF5Fix = await fnInsertFormPKF5FixSQL(data);
        
        if (resultSetPKF5Fix) {
            // ถ้า insert ข้อมูลสำเร็จ ให้ลอง update สถานะเอกสาร
            var updateSuccess = await fnUpdateStatusDocPKF5SQL(data);
            
            if (updateSuccess) {
                console.log('UpdateStatusDoc : Success');
                return res.status(200).json({ result: 'success' });
            } else {
                return res.status(500).json({ error: 'Failed to update all records', status: 'error' });
            }
        } else {
            return res.status(404).json({ message: "Data not found" });
        }

    } catch (error) {
        return res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnUpdateFormPKF5Fix = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnUpdateFormPKF5FixSQL");

        let updateSuccess = true;

        for (const data of dataArray) {
            const result = await fnUpdateFormPKF5FixSQL(data);

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocPKF5SQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

module.exports = {
    fnSetFormPKF5,
    fnSetSignaturePKF5,
    fnSetAssessorPKF5,
    fnInsertFormPKF5Fix,
    fnUpdateFormPKF5Fix
};
   