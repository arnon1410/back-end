
const {
    fnGetResultHighRiskSQL
} = require("../utils/sqlFunctions");

const {
    fnUpdateDataNameUnitPFMSQL,
    fnInsertDataNameUnitPFMSQL,
    fnUpdateDataAssessorPFMSQL,
    fnInsertDataAssessorPFMSQL,
    fnUpdateDataSignaturePFMSQL,
    fnInsertDataSignaturePFMSQL,
    fnUpdateFormPerformanceSQL,
    fnUpdateStatusDocPFMSQL,
    fnUpdateChanceRiskModalSQL,
    fnUpdateEffectRiskModalSQL,
    fnUpdateResultPFMEVSQL,
    // fnSetRankRiskModalSQL,
    fnUpdateResultHighRiskSQL,
    fnInsertResultHighRiskSQL
    
} = require("../utils/sqlPerformance");

const fnSetSideNamePFM = async (req, res) => {  
    const { userDocId, sideId, username, nameUnit, idConPFM } = req.body;

    const data = {
        userDocId,
        sideId,
        username,
        nameUnit,
        idConPFM
    };
  
    if (!userDocId || !sideId || !username) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSideNamePFM");
    let resultSetNameUnit = ''

    if (idConPFM) {
        resultSetNameUnit = await fnUpdateDataNameUnitPFMSQL(data);
        if (resultSetNameUnit) {
            res.status(200).json({ result: 'success' });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } else {
        resultSetNameUnit = await fnInsertDataNameUnitPFMSQL(data);
        if (resultSetNameUnit) {
            res.status(200).json({ result: resultSetNameUnit });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    }
        

    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignaturePFM = async (req, res) => {  
    const { userDocId, username, signPath, idConPFM } = req.body;

    const data = {
        userDocId,
        username,
        signPath,
        idConPFM
    };
    
  
    if (!userDocId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignaturePFM");
    let resultSetSignature = ''

        if (idConPFM) {
            resultSetSignature = await fnUpdateDataSignaturePFMSQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignaturePFMSQL(data);
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

const fnSetAssessorPFM = async (req, res) => {  
    const { userDocId, username, prefixAsessor, position, dateAsessor, idConPFM } = req.body;

    const data = {
        userDocId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConPFM
    };
    
  
    if (!userDocId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorPFM");
    let resultSetAssessor = ''

        if (idConPFM) {
            resultSetAssessor = await fnUpdateDataAssessorPFMSQL(data);
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorPFMSQL(data);
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

const fnSetFormPerformance = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormPerformance");

        let updateSuccess = true;
        let result = '';
        let resultHighRisk = '';

        for (const data of dataArray) {
            result = await fnUpdateFormPerformanceSQL(data);
            if (result) {
                resultHighRisk = await fnGetResultHighRiskSQL(data);
                if (resultHighRisk) {
                    const highRiskUpdate = await fnUpdateResultHighRiskSQL(data);
                    if (!highRiskUpdate) {
                        updateSuccess = false;
                        break;
                    }
                }
            } else {
                updateSuccess = false;
                break; // หยุดการวนลูปหากเกิดข้อผิดพลาด
            }
        }

        if (updateSuccess) {
            await fnUpdateStatusDocPFMSQL(dataArray[0]); // อัปเดตสถานะเอกสารเมื่ออัปเดตข้อมูลเสร็จสิ้นแล้ว
            console.log('UpdateStatusDoc : Success');
            res.status(200).json({ result: 'success' });
        } else {
            res.status(500).json({ error: 'Failed to update all records', status: 'error' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetChanceRiskModal = async (req, res) => {  
    const { idPFM, idQR, userId, sideId, username, type, frequencyLV1 , frequencyLV2 , frequencyLV3 , frequencyLV4 , frequencyLV5, chanceRiskScore , effectRiskScore , rankRiskScore , headRisk , objRisk, risking , activityControl, improvementControl } = req.body;

    const data = {
        idPFM,
        idQR,
        userId,
        sideId,
        username,
        type,
        frequencyLV1,
        frequencyLV2,
        frequencyLV3,
        frequencyLV4,
        frequencyLV5,
        chanceRiskScore,
        effectRiskScore,
        rankRiskScore,
        headRisk,
        objRisk,
        risking,
        activityControl,
        improvementControl
    };
    console.log(data)
    if (!idPFM || !userId || !sideId || !username || !type || !frequencyLV1 || !frequencyLV2 || !frequencyLV3 || !frequencyLV4  || !frequencyLV5 || !chanceRiskScore) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetChanceRiskModal");   
    
    const resultUpdateCR = await fnUpdateChanceRiskModalSQL(data);
    
    if (resultUpdateCR) {
        const resultUpdatePFMEV = await fnUpdateResultPFMEVSQL(data); // Update the Result_PFM_EV table here
        if (resultUpdatePFMEV) {
            if (data.rankRiskScore) {
                const resultHighRisk = await fnGetResultHighRiskSQL(data);
                if (resultHighRisk) {
                    console.log('fnUpdateResultHighRiskSQL')
                    await fnUpdateResultHighRiskSQL(data);
                } else {
                    if  (rankRiskScore >= 10) {
                        console.log('fnInsertResultHighRiskSQL')
                        await fnInsertResultHighRiskSQL(data);
                    }
                }
            }
            await fnUpdateStatusDocPFMSQL(data); 
            return res.status(200).json({ result: 'success' });
        } else {
            return res.status(404).json({ message: "Update to Result_PFM_EV failed" });
        }
    } else {
        return res.status(404).json({ message: "Update to ChanceRisk failed" });
    }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetEffectRiskModal = async (req, res) => {  
    const { idPFM, idQR, userId, sideId, username, type, damageLV1 , damageLV2 , damageLV3 , damageLV4 , damageLV5, chanceRiskScore , effectRiskScore , rankRiskScore , headRisk , objRisk, risking , activityControl, improvementControl } = req.body;

    const data = {
        idPFM,
        idQR,
        userId,
        sideId,
        username,
        type,
        damageLV1,
        damageLV2,
        damageLV3,
        damageLV4,
        damageLV5,
        chanceRiskScore,
        effectRiskScore,
        rankRiskScore,
        headRisk,
        objRisk,
        risking,
        activityControl,
        improvementControl
    };
    console.log(data)
    if (!idPFM || !userId || !sideId || !username || !type || !damageLV1 || !damageLV2 || !damageLV3 || !damageLV4  || !damageLV5 || !effectRiskScore || !headRisk || !objRisk || !risking) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
        console.log("/api/documents/fnSetEffectRiskModal");
        const resultUpdateER = await fnUpdateEffectRiskModalSQL(data);
        if (resultUpdateER) {
            const resultUpdatePFMEV = await fnUpdateResultPFMEVSQL(data); // Update the Result_PFM_EV table here

            if (resultUpdatePFMEV) {
                if (data.rankRiskScore) {
                    const resultHighRisk = await fnGetResultHighRiskSQL(data);
                    
                    if (resultHighRisk) {
                        await fnUpdateResultHighRiskSQL(data);
                    } else if (rankRiskScore >= 10) {
                        await fnInsertResultHighRiskSQL(data);
                    }
                }
                await fnUpdateStatusDocPFMSQL(data); 
                return res.status(200).json({ result: 'success' });
            } else {
                return res.status(404).json({ message: "Update to Result_PFM_EV failed" });
            }
        } else {
            res.status(404).json({ message: "Update to EffectRisk failed" });
        }
        res.status(200).json({ result: 'success' });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

module.exports = {
    fnSetSideNamePFM,
    fnSetSignaturePFM,
    fnSetAssessorPFM,
    fnSetFormPerformance,
    fnSetChanceRiskModal,
    fnSetEffectRiskModal,
    // fnSetRankRiskModal
};
   