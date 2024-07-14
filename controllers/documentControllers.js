const {
    fnGetResultDocSQL, fnGetResultQRSQL
} = require("../utils/sqlFunctions");

const fnGetResultDoc = async (req, res) => {
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
    const resultDoc = await fnGetResultDocSQL(data);
      
    if (resultDoc) {
        const combinedData = resultDoc.map(resDoc => ({
            id: resDoc.id,
            userID: resDoc.UserID,
            opSideID: resDoc.OPSideID,
            opFormID: resDoc.OPFormID,
            opStatusID: resDoc.OPStatusID,
            year: resDoc.year,
            comment: resDoc.comment,
            fileName: resDoc.fileName,
            fileSave: resDoc.fileSave,
            filePath: resDoc.filePath,
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
        res.status(200).json(combinedData);
    } else {
      res.status(404).json({ 
        message: "User not found",
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
      const resultQR = await fnGetResultQRSQL(data);
        
      if (resultQR) {
          const result = resultQR.map(resQR => ({
              id: resQR.id,
              checkbox: resQR.checkbox,
              fileName: resQR.fileName,
              fileSave: resQR.fileSave,
              filePath: resQR.filePath,
              descResultQR: resQR.descResultQR,
              UserID: resQR.UserID
            }));
          res.status(200).json(result);
      } else {
        res.status(404).json({ 
          message: "User not found",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
  };

module.exports = {
    fnGetResultDoc,
    fnGetResultQR
};