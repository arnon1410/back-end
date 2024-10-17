const {
    fnGetResultDocSQL,
    fnGetResultDocConditionSQL, 
    fnGetResultQRSQL, 
    fnGetResultEndQRSQL, 

    fnGetResultOtherOPSQL,
    fnGetResultOtherOPSubSQL,

    fnGetResultConQRSQL,

    fnGetResultASMSQL, 
    fnGetResultConASMSQL,
    fnGetResultCaseRiskSQL,

    fnGetResultPFMEVSQL,
    fnGetResultConPFMEVSQL,
    fnGetResultChanceRiskSQL,
    fnGetResultEffectRiskSQL,
    fnGetResultPK4SQL,
    fnGetResultConPK4SQL,
    fnGetResultHighRiskSQL,
    fnGetResultImprovePK4SQL,
    fnGetResultConPK5SQL,
    fnGetResultPK5FixSQL,
    fnGetResultConPKF5SQL,

    fnGetResultCollationSQL,

    fnUpdateCommentForAdminSQL,
    fnUpdateStatusDocAdminSQL
    
} = require("../utils/sqlFunctions");

const fnUpdateCommentForAdmin = async (req, res) => {
    const { idUserDoc, username, comment, status } = req.body;
    
    const data = {
      idUserDoc,
      username,
      comment,
      status
    };
  
    if (!idUserDoc || !username) {
      res
        .status(400)
        .json({ error: "idUserDoc or username fields cannot be empty!" });
      return;
    }
  
    try {
        let resultUpdate;
        if (status) {
            if (status === 'incomplete') {
                console.log("/api/documents/fnUpdateCommentForAdmin");
                resultUpdate = await fnUpdateCommentForAdminSQL(data);
            } else {
                console.log("/api/documents/fnUpdateStatusDocAdmin");
                resultUpdate = await fnUpdateStatusDocAdminSQL(data);

            }
        } else {
            console.log("/api/documents/fnUpdateCommentForAdmin");
            resultUpdate = await fnUpdateCommentForAdminSQL(data);
        }
        
        if (resultUpdate) {
            res.status(200).json({ result: 'success' });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
  };

const fnGetResultDoc = async (req, res) => {
  const { userId, sideId, formId, isAdmin } = req.body;
  
  const data = {
    userId,
    sideId,
    formId,
    isAdmin
  };

  if (!userId || !sideId) {
    res
      .status(400)
      .json({ error: "userId or sideId fields cannot be empty!" });
    return;
  }

  try {
    console.log("/api/documents/fnGetResultDoc");
    const resultDoc = await fnGetResultDocSQL(data);

    if (resultDoc === null) {
        return res.status(200).json({ result: [] });
    }
      
    if (resultDoc && resultDoc.length > 0) {
        const combinedData = resultDoc.map(resDoc => ({
            id: resDoc.id,
            userID: resDoc.UserID,
            opSideID: resDoc.OPSideID,
            opFormID: resDoc.OPFormID,
            opStatusID: resDoc.OPStatusID,
            year: resDoc.year,
            comment: resDoc.comment,
            signPath: resDoc.signPath,
            createdAt: resDoc.createdAt,
            createdBy: resDoc.createdBy,
            updatedAt: resDoc.updatedAt,
            updatedBy: resDoc.updatedBy,
            isActive: resDoc.isActive,
            username: resDoc.username,
            opSideName: resDoc.OPSideName,
            opFormName: resDoc.OPFormName,
            opStatusName: resDoc.OPStatusName
          }));
        res.status(200).json({ result: combinedData });
    } else {
      res.status(404).json({ 
        message: "Data not found",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
};

const fnGetResultDocCondition = async (req, res) => {
    const { unitId, sideId , year, status} = req.body;
    
    const data = {
      unitId,
      sideId,
      year,
      status
    };
  
    if (!sideId || !year) {
      res
        .status(400)
        .json({ error: "sideId or year sideId fields cannot be empty!" });
      return;
    }
  
    try {
      console.log("/api/documents/fnGetResultDocCondition");
      const resultDoc = await fnGetResultDocConditionSQL(data);
      if (resultDoc === null) {
        return res.status(200).json({ result: [] });
      }
        
      if (resultDoc && resultDoc.length > 0) {
            const result = resultDoc.map(resDoc => ({
              id: resDoc.id,
              year: resDoc.year,
              comment: resDoc.comment,
              signPath: resDoc.signPath,
              updatedAt: resDoc.updatedAt,
              shortName: resDoc.shortName,
              userID: resDoc.UserID,
              opStatusID: resDoc.OPStatusID,
              opFormID: resDoc.OPFormID,
              opSideID: resDoc.OPSideID,
              opFormName: resDoc.OPFormName,
              opStatusName: resDoc.OPStatusName
            }));
          res.status(200).json({ result: result });
      } else {
        res.status(404).json({ 
          message: "Data not found",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
  };

const fnGetResultQR = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
      userId,
      sideId
    };
  
    if (!userId || !sideId) {
      res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
      return;
    }
  
    try {
    console.log("/api/documents/fnGetResultQR");
    console.log(data)
      const resultQR = await fnGetResultQRSQL(data);
        if (resultQR === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultQR && resultQR.length > 0) {
          const result = resultQR.map(resSQL => ({
              id: resSQL.id,
              checkbox: resSQL.checkbox,
              fileName: resSQL.fileName,
              fileSave: resSQL.fileSave,
              filePath: resSQL.filePath,
              descResultQR: resSQL.descResultQR,
              UserID: resSQL.UserID,
              description: resSQL.resultNo
            }));
            res.status(200).json({ result: result });
      } else {
        res.status(404).json({ 
          message: "Data not found",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultEndQR = async (req, res) => {
    const { userId, sideId, otherId } = req.body;

    const data = {
        userId,
        sideId,
        otherId
    };

    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }

    try {
        console.log("/api/documents/fnGetResultEndQR");
        const resultEndQR = await fnGetResultEndQRSQL(data);

        if (resultEndQR === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultEndQR && resultEndQR.length > 0) {
            const result = resultEndQR.map(resSQL => ({
                idEndQR: resSQL.id,
                headID: resSQL.head_id,
                radio: resSQL.radio,
                descResultEndQR: resSQL.descResultEndQR,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultOtherQR = async (req, res) => {
    const { userId, sideId } = req.body;

    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }

    const data = {
        userId,
        sideId
    };

    const dataFix = [
        { id: 101 , sum_id: 401, value:  '', text: "การบริการ สวัสดิการ และสิทธิกำลังพล" },
        { id: 102 , sum_id: 402, value: '1', text: "มีการควบคุมเพียงพอ"},
        { id: 103 , sum_id: 403, value: '0', text: "กรณีไม่เพียงพอมีแนวทางหรือวิธีการปรับปรุงการควบคุมภายในให้ดีขึ้น ดังนี้"}
    ]

    try {
        console.log("/api/documents/fnGetResultOtherQR");

        const resultOtherOP = await fnGetResultOtherOPSQL(data);

        if (resultOtherOP === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultOtherOP && resultOtherOP.length > 0) {
            const resultMain = resultOtherOP.map(resSQL => ({
                id: resSQL.id, // from table Result QR
                id_control: resSQL.id_control,
                head_id: resSQL.head_id,
                mainControl_id: resSQL.mainControl_id,
                text: resSQL.text,
                objectName:resSQL.objectName,
                main_Obj: resSQL.main_Obj,
                UserID: resSQL.UserID
            }));

            const resultOtherSubOP = await fnGetResultOtherOPSubSQL(data);
            if (resultOtherSubOP === null) {
                return res.status(200).json({ result: [] });
            }

            if (resultOtherSubOP && resultOtherSubOP.length > 0) {
                const resultSub = resultOtherSubOP.map(resSQL => ({
                    id: resSQL.id,
                    id_control: resSQL.resultNo,
                    head_id: resSQL.head_id,
                    checkbox: resSQL.checkbox,
                    text: resSQL.text,
                    is_subcontrol: resSQL.is_subcontrol,
                    ischeckbox: resSQL.ischeckbox,
                    descResultQR: resSQL.descResultQR,
                    UserID: resSQL.UserID
                }));

                const result = resultMain.concat(resultSub, dataFix);
                res.status(200).json({ result: result });
            } else {
                res.status(200).json({ result: resultMain });
            }
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultConQR = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultConQR");
        const resultConQR = await fnGetResultConQRSQL(data);

        if (resultConQR === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultConQR && resultConQR.length > 0) {
            const result = resultConQR.map(resSQL => ({
                id: resSQL.id,
                descConQR: resSQL.descConQR,
                prefixAsessor: resSQL.prefixAsessor,
                signPath: resSQL.signPath,
                position: resSQL.position,
                dateAsessor: resSQL.dateAsessor,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultASM = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultASM");
        const resultASM = await fnGetResultASMSQL(data);

        if (resultASM === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultASM && resultASM.length > 0) {
            const result = resultASM.map(resSQL => ({
                id: resSQL.id,
                descResultASM: resSQL.descResultASM,
                resultNo: resSQL.resultNo,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultConASM = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultConASM");
        const resultConASM = await fnGetResultConASMSQL(data);

        if (resultConASM === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultConASM && resultConASM.length > 0) {
            const result = resultConASM.map(resSQL => ({
                id: resSQL.id,
                nameUnit: resSQL.nameUnit,
                descConASM: resSQL.descConASM,
                prefixAsessor: resSQL.prefixAsessor,
                signPath: resSQL.signPath,
                position: resSQL.position,
                dateAsessor: resSQL.dateAsessor,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultPFMEV = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultPFMEV");
        const resultPFMEV = await fnGetResultPFMEVSQL(data);

        if (resultPFMEV === null) {
            return res.status(200).json({ result: [] });
        }
    
        if (resultPFMEV && resultPFMEV.length > 0) {
            const result = resultPFMEV.map(resSQL => ({
                id: resSQL.id,
                idQR: resSQL.ResultQRID,
                headRisk: resSQL.headRisk,
                objRisk: resSQL.objRisk,
                risking: resSQL.risking,
                activityControl: resSQL.activityControl,
                chanceRiskScore: resSQL.chanceRiskScore,
                effectRiskScore: resSQL.effectRiskScore,
                rankRiskScore: resSQL.rankRiskScore,
                improvementControl: resSQL.improvementControl,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultConPFMEV = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultConPFMEV");
        const resultConPFMEV = await fnGetResultConPFMEVSQL(data);

        if (resultConPFMEV === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultConPFMEV && resultConPFMEV.length > 0) {
            const result = resultConPFMEV.map(resSQL => ({
                id: resSQL.id,
                nameUnit: resSQL.nameUnit,
                prefixAsessor: resSQL.prefixAsessor,
                signPath: resSQL.signPath,
                position: resSQL.position,
                dateAsessor: resSQL.dateAsessor,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultChanceRisk = async (req, res) => {
    const { PFM_EVId, userId, sideId } = req.body;
    
    const data = {
        PFM_EVId,
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultChanceRisk");
        const resultChanceRisk = await fnGetResultChanceRiskSQL(data);

        if (resultChanceRisk === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultChanceRisk && resultChanceRisk.length > 0) {
            const result = resultChanceRisk.map(resSQL => ({
                id: resSQL.id,
                frequencyLV1: resSQL.frequencyLV1,
                frequencyLV2: resSQL.frequencyLV2,
                frequencyLV3: resSQL.frequencyLV3,
                frequencyLV4: resSQL.frequencyLV4,
                frequencyLV5: resSQL.frequencyLV5,
                chanceRiskScore: resSQL.chanceRiskScore,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultEffectRisk = async (req, res) => {
    const { PFM_EVId, userId, sideId } = req.body;
    
    const data = {
        PFM_EVId,
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultEffectRisk");
        const resultEffectRisk = await fnGetResultEffectRiskSQL(data);

        if (resultEffectRisk === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultEffectRisk && resultEffectRisk.length > 0) {
            const result = resultEffectRisk.map(resSQL => ({
                id: resSQL.id,
                damageLV1: resSQL.damageLV1,
                damageLV2: resSQL.damageLV2,
                damageLV3: resSQL.damageLV3,
                damageLV4: resSQL.damageLV4,
                damageLV5: resSQL.damageLV5,
                effectRiskScore: resSQL.effectRiskScore,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultPK4 = async (req, res) => {
    const { userId } = req.body;
    
    const data = {
        userId
    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultPK4");
        const resultPK4 = await fnGetResultPK4SQL(data);

        if (resultPK4 === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultPK4 && resultPK4.length > 0) {
            const result = resultPK4.map(resSQL => ({
                id: resSQL.id,
                descResultPK4: resSQL.descResultPK4,
                shortName: resSQL.shortName,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultConPK4 = async (req, res) => {
    const { userId } = req.body;
    
    const data = {
        userId    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultConPK4");
        const resultConPK4 = await fnGetResultConPK4SQL(data);
        
        if (resultConPK4 === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultConPK4 && resultConPK4.length > 0) {
            const result = resultConPK4.map(resSQL => ({
                id: resSQL.id,
                shortName: resSQL.shortName,
                descConPK4: resSQL.descConPK4,
                prefixAsessor: resSQL.prefixAsessor,
                signPath: resSQL.signPath,
                position: resSQL.position,
                dateAsessor: resSQL.dateAsessor,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultHighRisk = async (req, res) => {
    const { userId , strYear} = req.body;
    
    const data = {
        userId,
        strYear
    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultHighRisk");
        const resultHighRisk = await fnGetResultHighRiskSQL(data);
        if (resultHighRisk === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultHighRisk && resultHighRisk.length > 0) {
            const result = resultHighRisk.map(resSQL => ({
                id: resSQL.id,
                idSides: resSQL.OPSideID,
                sideName: resSQL.OPSideName,
                headRisk: resSQL.headRisk,
                objRisk: resSQL.objRisk,
                risking: resSQL.risking,
                existingControl: resSQL.existingControl,
                evaluationControl: resSQL.evaluationControl,
                existingRisk: resSQL.existingRisk,
                activityControl: resSQL.activityControl,
                improvementControl: resSQL.improvementControl,
                responsibleAgency: resSQL.responsibleAgency,
                progressControl: resSQL.progressControl,
                solutionsControl: resSQL.solutionsControl,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultImprovePK4 = async (req, res) => {
    const { userId , strYear} = req.body;
    
    const data = {
        userId,
        strYear
    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultImprovePK4");
        const resultImprovePK4 = await fnGetResultImprovePK4SQL(data);
        if (resultImprovePK4 === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultImprovePK4 && resultImprovePK4.length > 0) {
            const result = resultImprovePK4.map(resSQL => ({
                id: resSQL.id,
                descResultEndQR: resSQL.descResultEndQR,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultPK5Fix = async (req, res) => {
    const { userId } = req.body;
    
    const data = {
        userId
    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultPK5Fix");
        const resultPK5Fix = await fnGetResultPK5FixSQL(data);
        
        if (resultPK5Fix === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultPK5Fix && resultPK5Fix.length > 0) {
            const result = resultPK5Fix.map(resSQL => ({
                id: resSQL.id,
                idSides: resSQL.OPSideID,
                sideName: resSQL.OPSideName,
                headRisk: resSQL.headRisk,
                objRisk: resSQL.objRisk,
                risking: resSQL.risking,
                improvementControl: resSQL.improvementControl,
                responsibleAgency: resSQL.responsibleAgency,
                progressControl: resSQL.progressControl,
                solutionsControl: resSQL.solutionsControl,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({
            result: '',
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultConPK5 = async (req, res) => {
    const { userId } = req.body;
    
    const data = {
        userId    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultConPK5");
        const resultConPK5 = await fnGetResultConPK5SQL(data);

        if (resultConPK5 === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultConPK5 && resultConPK5.length > 0) {
            const result = resultConPK5.map(resSQL => ({
                id: resSQL.id,
                shortName: resSQL.shortName,
                prefixAsessor: resSQL.prefixAsessor,
                signPath: resSQL.signPath,
                position: resSQL.position,
                dateAsessor: resSQL.dateAsessor,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultConPKF5 = async (req, res) => {
    const { userId } = req.body;
    
    const data = {
        userId    };
    
    if (!userId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultConPKF5");
        const resultConPKF5 = await fnGetResultConPKF5SQL(data);

        if (resultConPKF5 === null) {
            return res.status(200).json({ result: [] });
        }

        if (resultConPKF5 && resultConPKF5.length > 0) {
            const result = resultConPKF5.map(resSQL => ({
                id: resSQL.id,
                shortName: resSQL.shortName,
                prefixAsessor: resSQL.prefixAsessor,
                signPath: resSQL.signPath,
                position: resSQL.position,
                dateAsessor: resSQL.dateAsessor,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultCaseRisk = async (req, res) => {
    const { userId, sideId } = req.body;
    
    const data = {
        userId,
        sideId
    };
    
    if (!userId || !sideId) {
        res
        .status(400)
        .json({ error: "userId or sideId fields cannot be empty!" });
        return;
    }
    
    try {
        console.log("/api/documents/fnGetResultCaseRisk");
        const resultCaseRisk = await fnGetResultCaseRiskSQL(data);

        if (resultCaseRisk === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultCaseRisk && resultCaseRisk.length > 0) {
            const result = resultCaseRisk.map(resSQL => ({
                id: resSQL.id,
                OPM_Desc: resSQL.OPM_Desc,
                UserID: resSQL.UserID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

const fnGetResultCollation = async (req, res) => {
    const { userId, sendId, year, status} = req.body;
    
    const data = {
      userId,
      sendId,
      year,
      status
    };
    
    try {
        console.log("/api/documents/fnGetResultCollation");
        const resultCollation = await fnGetResultCollationSQL(data);

        if (resultCollation === null) {
            return res.status(200).json({ result: [] });
        }
        
        if (resultCollation && resultCollation.length > 0) {
            const result = resultCollation.map(resSQL => ({
                id: resSQL.id,
                fileName: resSQL.fileName,
                fileData: resSQL.fileData,
                sendName: resSQL.sendName,
                receiveName: resSQL.receiveName,
                statusID: resSQL.OPStatusID,
                updatedAt: resSQL.updatedAt,
                userDocID: resSQL.userDocID
            }));
            res.status(200).json({ result: result });
        } else {
        res.status(404).json({ 
            message: "Data not found",
        });
        }
    } catch (error) {
        res.status(500).json({ error: error.message, status: 'error' });
    }
};

module.exports = {
    fnUpdateCommentForAdmin,
    fnGetResultDoc,
    fnGetResultDocCondition,
    fnGetResultQR,
    fnGetResultEndQR,
    fnGetResultOtherQR,
    fnGetResultConQR,
    fnGetResultASM,
    fnGetResultConASM,
    fnGetResultCaseRisk,
    fnGetResultPFMEV,
    fnGetResultConPFMEV,
    fnGetResultChanceRisk,
    fnGetResultEffectRisk,
    fnGetResultPK4,
    fnGetResultConPK4,
    fnGetResultHighRisk,
    fnGetResultImprovePK4,
    fnGetResultPK5Fix,
    fnGetResultConPK5,
    fnGetResultConPKF5,

    fnGetResultCollation
};