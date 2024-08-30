const {
    fnUpdateFormPK5SQL,
    fnUpdateConPK5SQL,
    fnUpdateStatusDocPK5SQL,
    fnUpdateDataAssessorPK5SQL,
    fnInsertDataAssessorPK5SQL,
    fnUpdateDataSignaturePK5SQL,
    fnInsertDataSignaturePK5SQL, 
    
} = require("../utils/sqlPK5");



const fnSetFormPK5 = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormPK5");

        let updateSuccess = true;

        for (const data of dataArray) {
            const result = await fnUpdateFormPK5SQL(data);

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocPK5SQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignaturePK5 = async (req, res) => {  
    const { userId, username, signPath, idConPK5 } = req.body;

    const data = {
        userId,
        username,
        signPath,
        idConPK5
    };
    
  
    if (!userId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignaturePK5");
    let resultSetSignature = ''

        if (idConPK5) {
            resultSetSignature = await fnUpdateDataSignaturePK5SQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignaturePK5SQL(data);
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

const fnSetAssessorPK5 = async (req, res) => {  
    const { userId, username, prefixAsessor, position, dateAsessor, idConPK5 } = req.body;

    const data = {
        userId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConPK5
    };
    
  
    if (!userId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorPK5");
    let resultSetAssessor = ''

        if (idConPK5) {
            resultSetAssessor = await fnUpdateDataAssessorPK5SQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorPK5SQL(data);
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
    fnSetFormPK5,
    fnSetSignaturePK5,
    fnSetAssessorPK5
};
   