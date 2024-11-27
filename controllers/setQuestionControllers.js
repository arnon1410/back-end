const {
    fnGetResultQRSQL,
    fnGetResultOPMSQL,
    fnGetResultEndQRSQL,
    fnUpdateResultEndQRSQL,
    fnInsertResultEndQRSQL,
    fnGetResultOtherOPSubSQL,
    fnGetResultConQRSQL,
   
    // fnUpdateResultSubPFM_EV
} = require("../utils/sqlFunctions");

const {
    fnUpdateResultQRSQL,
    fnUpdateResultOPMSQL,
    fnUpdateResultPFM_EV,
    // fnInsertResultOPMSQL,
    fnSetResultRiskSQL,
    fnUpdateResultOtherOPSubSQL,
    fnUpdateResultPFM_EVSub,
    fnUpdateResultOPMSubSQL,
    fnUpdateStatusDocQRSQL,
    fnUpdateResultConQRSQL,
    fnInsertResultConQRSQL,
    fnSetQuestionOtherSQL,

    fnUpdateDataAssessorQRSQL,
    fnInsertDataAssessorQRSQL,
    fnUpdateDataSignatureQRSQL,
    fnInsertDataSignatureQRSQL

} = require("../utils/sqlQuestion");

const fnSetFormQuestion = async (req, res) => {
    const dataArray = req.body; // รับค่ามาเป็น array ของ objects

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return res.status(400).json({ error: "Request body must be a non-empty array of objects!" });
    }

    try {
        console.log("/api/documents/fnSetFormQuestion");
        let results = {
            mainQR: [],
            mainEndQR: [],
            subQR: [],
            subEndQR: [],
            conQR: []
        };

        for (const data of dataArray) {
            const { type, ...otherFields } = data;

            switch (type) {
                case 'mainQR':
                    const resultMainQR = await fnProcessMainQR(otherFields);
                    results.mainQR.push(...resultMainQR);
                    break;

                case 'mainEndQR':
                    const resultMainEndQR = await fnProcessMainEndQR(otherFields);
                    results.mainEndQR.push(...resultMainEndQR);
                    break;

                case 'subQR':
                    const resultSubQR = await fnProcessSubQR(otherFields);
                    results.subQR.push(...resultSubQR);
                    break;

                case 'conQR':
                    const resultConQR = await fnProcessConQR(otherFields);
                    results.conQR.push(...resultConQR);
                    break;

                default:
                    console.log(`Unknown type: ${type}`);
                    break;
            }
        }
        const hasResults = Object.values(results).flat().filter(item => item !== null && item !== undefined).length > 0;

        if (hasResults) {
            await fnUpdateStatusDocQRSQL(dataArray[0]); // Update status Document
            console.log('UpdateStatusDoc : Success');
        }

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnProcessMainQR = async (fields) => {
    try {
        console.log('fnProcessMainQR')
        const resultQR = await fnGetResultQRSQL(fields);
        let resultQROld = { data: [] }; // กำหนดค่าเริ่มต้นเป็นอ็อบเจกต์ที่มี data เป็นอาร์เรย์ว่าง
        if (resultQR && resultQR.length > 0) {
            resultQROld = {
                data: resultQR.map(resSQL => ({
                    idQR: resSQL.id,
                    checkboxOld: resSQL.checkbox,
                    descRiskQROld: resSQL.descRiskQR,
                    descImproveQROld: resSQL.descImproveQR,
                }))
            };

            if (fields.checkbox === 'n') {
                let resultOPMOld = { data: [] }; // กำหนดค่าเริ่มต้นเป็นอ็อบเจกต์ที่มี data เป็นอาร์เรย์ว่าง
                const resultOPM = await fnGetResultOPMSQL(fields);

                if (resultOPM && resultOPM.length > 0) {
                    resultOPMOld = {
                        data: resultOPM.map(resSQL => ({
                            idOPM: resSQL.id,
                            nameOld: resSQL.OPM_Name,
                            objectiveOld: resSQL.OPM_Objective,
                            riskOld: resSQL.OPM_Risk, // แก้ไขเป็น OPM_Desc แทน riskOld เพื่อให้ตรงกับโครงสร้างที่ต้องการ
                            improveOld: resSQL.OPM_Improve
                        }))
                    };
            
                    const isEqualOPM = 
                        resultOPMOld.data[0].nameOld === fields.headName &&
                        resultOPMOld.data[0].objectiveOld === fields.objName &&
                        resultOPMOld.data[0].riskOld === fields.descRiskQR &&
                        resultOPMOld.data[0].improveOld === fields.descImproveQR;
                    if (!isEqualOPM) {
                        await fnUpdateResultOPMSQL(fields);
                        console.log('UpdateResultOPM : Success');

                        await fnUpdateResultPFM_EV(fields);
                        console.log('UpdateResultPFM_EV : Success');
                    }
                } else {
                    await fnSetResultRiskSQL(fields);
                    console.log('InsertResultRisk : Success');

                }
            }

            // ตรวจสอบว่าค่า checkboxOld เท่ากับ checkbox และ descRiskQROld เท่ากับ descRiskQR หรือไม่
            const isEqualQR = 
            resultQROld.data[0].checkboxOld === fields.checkbox &&
            resultQROld.data[0].descRiskQROld === fields.descRiskQR &&
            resultQROld.data[0].descImproveQROld === fields.descImproveQR ;

            // ถ้าไม่เท่ากัน ให้คอลฟังก์ชัน fnUpdateResultQRSQL
            if (!isEqualQR) {
                await fnUpdateResultQRSQL(fields);
                console.log('UpdateResultQR : Success');
            }
        }

        return resultQROld.data; // ส่งค่ากลับเป็นอาร์เรย์ที่มีข้อมูลที่ต้องการ
    } catch (error) {
        throw new Error(error.message); // ส่งข้อผิดพลาดออกไป
    }
};

const fnProcessMainEndQR = async (fields) => {
    try {
        console.log('fnProcessMainEndQR')
        const resultEndQR = await fnGetResultEndQRSQL(fields);
        let resultEndQROld = { data: [] }; // กำหนดค่าเริ่มต้นเป็นอ็อบเจกต์ที่มี data เป็นอาร์เรย์ว่าง
        if (resultEndQR && resultEndQR.length > 0) {
            resultEndQROld = {
                data: resultEndQR.map(resSQL => ({
                    idEndQR: resSQL.id,
                    radioOld: resSQL.radio,
                    descResultEndQROld: resSQL.descResultEndQR
                }))
            };

            // ตรวจสอบว่าค่า radioOld เท่ากับ radio และ descRiskQROld เท่ากับ descRiskQR หรือไม่
            const isEqualQR = 
                resultEndQROld.data[0].radioOld === fields.radio &&
                resultEndQROld.data[0].descResultEndQROld === fields.descResultEndQR;
            // ถ้าไม่เท่ากัน ให้คอลฟังก์ชัน fnUpdateResultEndQRSQL
            if (!isEqualQR) {
                await fnUpdateResultEndQRSQL(fields);
                console.log('UpdateResultEndQR : Success');
            }
        } else { // กรณีที่ insert จะมีแค่ข้อมูลจาก main เท่านั้นเนื่องจาก other จะมี id อยู่แล้ว
            await fnInsertResultEndQRSQL(fields);
            console.log('InsertResultEndQR : Success');
        } 

        return resultEndQROld.data; // ส่งค่ากลับเป็นอาร์เรย์ที่มีข้อมูลที่ต้องการ
    } catch (error) {
        throw new Error(error.message); // ส่งข้อผิดพลาดออกไป
    }
};

const fnProcessSubQR = async (fields) => {
    try {
        console.log('fnProcessSubQR')
        const resultOtherOP = await fnGetResultOtherOPSubSQL(fields);
        let resultOtherOPOld = { data: [] }; // กำหนดค่าเริ่มต้นเป็นอ็อบเจกต์ที่มี data เป็นอาร์เรย์ว่าง

        if (resultOtherOP && resultOtherOP.length > 0) {
            resultOtherOPOld = {
                data: resultOtherOP.map(resSQL => ({
                    idQR: resSQL.id,
                    descResultOtherOPOld: resSQL.descRiskQR
                }))
            };

            // ตรวจสอบว่าค่า checkboxOld เท่ากับ checkbox และ descRiskQROld เท่ากับ descRiskQR หรือไม่
            const isEqualQR = resultOtherOPOld.data[0].descResultOtherOPOld === fields.descResultEndQR;

            // ถ้าไม่เท่ากัน ให้คอลฟังก์ชัน fnUpdateResultQRSQL
            if (!isEqualQR) {
                
                await fnUpdateResultOtherOPSubSQL(fields);
                console.log('UpdateResultOtherOPSub : Success');

                await fnUpdateResultOPMSubSQL(fields);
                console.log('UpdateResultOPMSub : Success');

                await fnUpdateResultPFM_EVSub(fields);
                console.log('UpdateResultPFM_EVSub : Success');
            }
        }

        return resultOtherOPOld.data; // ส่งค่ากลับเป็นอาร์เรย์ที่มีข้อมูลที่ต้องการ
    } catch (error) {
        throw new Error(error.message); // ส่งข้อผิดพลาดออกไป
    }
};

const fnProcessConQR = async (fields) => {
    try {
        console.log('fnProcessConQR')
        const resultConQR = await fnGetResultConQRSQL(fields);
        let resultConQRStatus = { data: [] }; // กำหนดค่าเริ่มต้นเป็นอ็อบเจกต์ที่มี data เป็นอาร์เรย์ว่าง

        if (resultConQR && resultConQR.length > 0) {
            // อาจจะไม่มีการ check ตัว descConQR เนื่องจากจะทำให้โค้ดช้าเพราะเป็นการเปรียบเทียบของสตริงที่มีขนาดยาวมาก
            await fnUpdateResultConQRSQL(fields);
            console.log('UpdateResultConQR : Success');
        } else { // กรณีที่ insert จะมีแค่ข้อมูลจาก main เท่านั้นเนื่องจาก other จะมี id อยู่แล้ว
            await fnInsertResultConQRSQL(fields);
            console.log('InsertResultConQR : Success');
        } 

        return resultConQRStatus.data; // ส่งค่ากลับเป็นอาร์เรย์ที่มีข้อมูลที่ต้องการ
    } catch (error) {
        throw new Error(error.message); // ส่งข้อผิดพลาดออกไป
    }
};

const fnSetQuestionOther = async (req, res) => {  
    const { userId, userDocId, sideId, username, idControlHead, idControlSub, idControlSub2, headId, headText, subText, subText2, objectName, descRisking, descRisking2, descImprove } = req.body;

    const data = {
        userId,
        userDocId,
        sideId,
        username,
        idControlHead,
        idControlSub,
        // idControlSub2,
        headId,
        headText,
        subText,
        // subText2,
        objectName,
        descRisking,
        // descRisking2,
        descImprove
    };

  
    if (!userId || !userDocId || !sideId || !username || !idControlHead || !idControlSub || !headId || !headText || !subText || !objectName || !descRisking || !descImprove) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetQuestionOther");
        const resultSetOther = await fnSetQuestionOtherSQL(data);
        if (resultSetOther) {
            res.status(200).json({ result: 'success' });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnSetSignatureQR = async (req, res) => {  
    const { userDocId, username, signPath, idConQR } = req.body;

    const data = {
        userDocId,
        username,
        signPath,
        idConQR
    };
    
  
    if (!userDocId || !username || !signPath) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetSignatureQR");
    let resultSetSignature = ''

        if (idConQR) {
            resultSetSignature = await fnUpdateDataSignatureQRSQL(data);
            if (resultSetSignature) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetSignature = await fnInsertDataSignatureQRSQL(data);
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

const fnSetAssessorQR = async (req, res) => {  
    const { userDocId, username, prefixAsessor, position, dateAsessor, idConQR } = req.body;

    const data = {
        userDocId,
        username,
        prefixAsessor,
        position,
        dateAsessor,
        idConQR
    };
    
  
    if (!userDocId || !username || !prefixAsessor || !position || !dateAsessor) {
        return res.status(400).json({ error: "some fields cannot be empty!" });
    }
    try {
    console.log("/api/documents/fnSetAssessorQR");
    let resultSetAssessor = ''

        if (idConQR) {
            resultSetAssessor = await fnUpdateDataAssessorQRSQL(data);
            console.log('Update result:', resultSetAssessor);  // ตรวจสอบผลลัพธ์ที่ได้
            if (resultSetAssessor) {
                res.status(200).json({ result: 'success' });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } else {
            resultSetAssessor = await fnInsertDataAssessorQRSQL(data);
            console.log('Insert result:', resultSetAssessor);  // ตรวจสอบผลลัพธ์ที่ได้
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
    fnSetFormQuestion,
    fnSetQuestionOther,
    fnSetSignatureQR,
    fnSetAssessorQR
};
   