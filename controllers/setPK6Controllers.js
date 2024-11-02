const {
    fnUpdateFormPK6SQL,
    fnUpdateStatusDocPK6SQL,
    fnUpdateDataAssessorPK6SQL,
    fnInsertDataAssessorPK6SQL,
    fnUpdateDataSignaturePK6SQL,
    fnInsertDataSignaturePK6SQL,
    
} = require("../utils/sqlPK6");



const fnSetFormPK6 = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormPK6");

        let updateSuccess = true;

        for (const data of dataArray) {
            const result = await fnUpdateFormPK6SQL(data);

            if (!result) {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocPK6SQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignaturePK6 = async (req, res) => {  
    const { userDocId, username, signPath, idConPK6 } = req.body;

    const data = {
        userDocId,
        username,
        signPath,
        idConPK6
    };
    
  
    if (!userDocId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignaturePK6");
    let resultSetSignature = ''

        if (idConPK6) {
            resultSetSignature = await fnUpdateDataSignaturePK6SQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignaturePK6SQL(data);
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

const fnSetAssessorPK6 = async (req, res) => {  
    const { userDocId, username, prefixAsessor, position, dateAsessor, idConPK6 } = req.body;

    const data = {
        userDocId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConPK6
    };
    
  
    if (!userDocId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorPK6");
    let resultSetAssessor = ''

        if (idConPK6) {
            resultSetAssessor = await fnUpdateDataAssessorPK6SQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorPK6SQL(data);
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
    fnSetFormPK6,
    fnSetSignaturePK6,
    fnSetAssessorPK6
};
   