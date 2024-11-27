const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const fnCreateTableSQL = (schema) => {
  return new Promise((resolve, reject) => {
    pool.query(schema, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fnCheckRecordExistsSQL = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName} WHERE ${column} = '${value}'`;
    pool.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
};

const fnInsertRecordSQL = (tableName, record) => {
  return new Promise((resolve, reject) => {
    // const strColumn = Object.keys(record)
    // const strValue = Object.values(record).map(value => `"${value}"`);
    
    const query = `INSERT INTO ${tableName} SET userId='${record.userId}', username='${record.username}', password='${record.password}', unitName='${record.unitName}', shortName='${record.shortName}', userRole='${record.userRole}'`;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const fnGetResultDocSQL = (record) => {
  var conditionFormId = ''
  if (record.formId) { // ถ้าไม่ใช่ Admin 
    conditionFormId = `AND d.id = ${record.formId} `
  }
  return new Promise((resolve, reject) => {
    const query = `SELECT a.*, b.username, c.OPSideName, d.OPFormName, e.OPStatusName
      FROM Result_UserDoc as a 
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Sides as c ON a.OPSideID = c.id
      INNER JOIN OP_Form as d ON a.OPFormID = d.id
      INNER JOIN OP_Status as e ON a.OPStatusID = e.id 
      WHERE a.opSideID <> 1
      AND b.id = ${record.userId} AND c.id = ${record.sideId}
      ${conditionFormId}
      ORDER BY OPFormID
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultDocConditionSQL = (record) => {
  return new Promise((resolve, reject) => {
    var conditionUnitName = ''
    var conditionStatus = ''
    if (record.unitId) {
      conditionUnitName = `AND b.id = ${record.unitId}`
    }
    if (record.status) {
      conditionStatus = `AND a.OPStatusID = '${record.status}'`
    }
    const query = `SELECT 
        a.id,
        a.year,
        a.comment,
        a.signPath,
        a.UserID,
        a.OPStatusID,
        a.OPFormID,
        a.OPSideID,
        CAST(a.updatedAt AS CHAR) as updatedAt,
        b.shortName,
        d.OPFormName,
        e.OPStatusName
      FROM Result_UserDoc as a 
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Sides as c ON a.OPSideID = c.id
      INNER JOIN OP_Form as d ON a.OPFormID = d.id
      INNER JOIN OP_Status as e ON a.OPStatusID = e.id 
      WHERE c.id = ${record.sideId} AND a.year = ${record.year} AND d.id <> 1 
      ${conditionUnitName}
      ${conditionStatus}
      ORDER BY a.id, d.OPFormName;
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultQRSQL = (record) => {
  var conditionSpecific = ''
  if (record.idQR) {
    conditionSpecific = `AND a.id = ${record.idQR}`
  }
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.checkbox, a.descResultQR, a.resultNo, b.UserID, d.fileName
      FROM Result_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      LEFT JOIN Result_File_QR as d ON a.id = d.ResultQRID
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId} AND b.OPFormID = 2
      AND a.OtherID IS NULL
      ${conditionSpecific}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultOPMSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT id ,OPM_Name, OPM_Objective, OPM_Desc FROM OPM 
      WHERE ResultDocID = ? 
      AND ResultQRID = ? 
      AND isActive = 1
      AND YEAR(updatedAt) = YEAR(CURDATE())
    `;

    const params = [record.userDocId, record.idQR];
    
    pool.query(query, params, (err, results) => {
      if (err) {
        reject(new Error(`SQL Error: ${err.message}`));
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultEndQRSQL = (record) => {
  var conditionOther = ''
  var conditionIdEndQR = ''
  var conditionIdHead = ''

  if (record.otherId) {
    conditionOther = `AND a.OtherID = ${record.otherId}`
  }

  if (record.idEndQR) {
    conditionIdEndQR = `AND a.id = ${record.idEndQR}`
  }

  if (record.head_id) {
    conditionIdEndQR = `AND a.head_id = ${record.head_id}`
  }

  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.head_id, a.radio, a.descResultEndQR, b.UserID
      FROM Result_End_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId}
      ${conditionOther}
      ${conditionIdEndQR}
      ${conditionIdHead}
      ORDER BY head_id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnUpdateResultEndQRSQL = (data) => {
  return new Promise((resolve, reject) => {
      // ตรวจสอบว่า data มีค่าที่ต้องการ
      if (!data.radio || !data.username || !data.idEndQR) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
          UPDATE Result_End_QR SET radio = ?, descResultEndQR = ?, updatedBy = ? WHERE id = ?
      `;
      const params = [data.radio , data.descResultEndQR , data.username, data.idEndQR];
      pool.query(query, params, (err, result) => {
        if (err) {
            // ส่งข้อความข้อผิดพลาดที่ชัดเจน
            reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
        } else {
            resolve(result);
        }
      });
  });
};

const fnInsertResultEndQRSQL = (data) => {
  return new Promise((resolve, reject) => {
      // ตรวจสอบว่า data มีค่าที่ต้องการ
      if (!data || !data.userDocId || !data.head_id  || !data.username) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
        INSERT INTO Result_End_QR (ResultDocID, head_id, radio, descResultEndQR, createdBy, updatedBy, isActive)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `;
      const params = [parseInt(data.userDocId, 10), data.head_id, data.radio, data.descResultEndQR, data.username, data.username];

      pool.query(query, params, (err, result) => {
          if (err) {
              // ส่งข้อความข้อผิดพลาดที่ชัดเจน
              reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
          } else {
              resolve(result);
          }
      });
  });
};

const fnGetResultOtherOPSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.id_control, a.head_id, a.mainControl_id, a.text,
      'วัตถุประสงค์ของการควบคุม' as main_Obj, objectName, b.UserID
      FROM OTHER_OP as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ? AND b.OPSideID = ?
      ORDER BY a.id`;
    pool.query(query, [record.userId, record.sideId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultOtherOPSubSQL = (record) => {
  var conditionSpecific = ''
  if (record.idQR) {
    conditionSpecific = `AND a.ResultQRID = ${record.idQR}`
  }
  return new Promise((resolve, reject) => {
    const query = `SELECT c.id , c.resultNo, a.text, 0 as is_subcontrol, 1 as ischeckbox, c.checkbox, c.descResultQR
      FROM OTHER_S_OP as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Result_QR as c ON a.ResultQRID = c.id
      INNER JOIN OTHER_OP as d ON a.OtherID = d.id
      INNER JOIN Users as e ON b.UserID = e.id
      WHERE c.OtherID IS NOT NULL 
      AND e.id = ? AND b.OPSideID = ?
      ${conditionSpecific}
      ORDER BY a.id`;
    pool.query(query, [record.userId, record.sideId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConQRSQL = (record) => {
  var conditionSpecific = ''
  if (record.idConQR) {
    conditionSpecific = `AND a.id = ${record.idConQR}`
  }
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.descConQR,  a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID
      FROM Result_CON_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId}
      ${conditionSpecific}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultASMSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.ResultDocID, a.descResultASM, a.resultNo, b.UserID
      FROM Result_ASM as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId}
      AND a.isActive = 1
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConASMSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.nameUnit,  a.descConASM,  a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID
      FROM Result_CON_ASM as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultPFMEVSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.ResultQRID, a.headRisk , a.objRisk, a.risking, a.activityControl, a.chanceRiskScore , a.effectRiskScore, a.rankRiskScore, a.improvementControl, c.UserID
      FROM Result_PFM_EV as a
      INNER JOIN Result_QR as b ON a.ResultQRID = b.id
      INNER JOIN Result_UserDoc as c ON b.ResultDocID = c.id
      INNER JOIN Users as d ON c.UserID = d.id
      WHERE d.id = ${record.userId} AND c.OPSideID = ${record.sideId}
      ORDER BY a.ResultQRID
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConPFMEVSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.nameUnit, a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, c.UserID
      FROM Result_CON_PFM_EV as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultChanceRiskSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.frequencyLV1, a.frequencyLV2, a.frequencyLV3, a.frequencyLV4, a.frequencyLV5, a.chanceRiskScore, d.UserID
      FROM Result_ChanceRisk as a
      INNER JOIN Result_PFM_EV as b ON a.ResultPFM_EV_ID = b.id  
      INNER JOIN Result_QR as c ON b.ResultQRID = c.id
      INNER JOIN Result_UserDoc as d ON c.ResultDocID = d.id
      INNER JOIN Users as e ON d.UserID = e.id
      WHERE a.ResultPFM_EV_ID = ${record.PFM_EVId} 
      AND e.id = ${record.userId} 
      AND d.OPSideID = ${record.sideId}
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultEffectRiskSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.damageLV1, a.damageLV2, a.damageLV3, a.damageLV4, a.damageLV5, a.effectRiskScore, d.UserID
      FROM Result_EffectRisk as a
      INNER JOIN Result_PFM_EV as b ON a.ResultPFM_EV_ID = b.id  
      INNER JOIN Result_QR as c ON b.ResultQRID = c.id
      INNER JOIN Result_UserDoc as d ON c.ResultDocID = d.id
      INNER JOIN Users as e ON d.UserID = e.id
      WHERE a.ResultPFM_EV_ID = ${record.PFM_EVId} 
      AND e.id = ${record.userId} 
      AND d.OPSideID = ${record.sideId}
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultPK4SQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.ResultDocID, a.descResultPK4 , b.UserID, c.shortName
      FROM Result_PK4 as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConPK4SQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id,  a.descConPK4,  a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID, c.shortName
      FROM Result_CON_PK4 as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultHighRiskSQL = (record) => {
  return new Promise((resolve, reject) => {
    var conditionYear = ''
    var conditionIdQR = ''
    if (record.strYear) {
      conditionYear = `AND c.year = ${record.strYear}`
    }
    if (record.idQR) { // กรณีที่ UPDATE 
      conditionIdQR = `AND a.ResultQRID = ${record.idQR}`
    } else {
      conditionIdQR = `AND a.isActive = 1 `
    }
    const query = `SELECT a.id, a.ResultQRID, a.headRisk, a.objRisk, a.risking, a.existingControl, a.evaluationControl,
      a.existingRisk, a.improvementControl, a.responsibleAgency,a.progressControl, a.solutionsControl,
      c.UserID, c.OPSideID, e.OPSideName
      FROM Result_High_Risk as a
      INNER JOIN Result_QR as b ON a.ResultQRID = b.id
      INNER JOIN Result_UserDoc as c ON b.ResultDocID = c.id
      INNER JOIN Users as d ON c.UserID = d.id
      INNER JOIN OP_Sides e ON c.OPSideID = e.id
      WHERE d.id = ${record.userId}
      ${conditionYear}
      ${conditionIdQR}
      ORDER BY a.id 
    `; // แก้คิวรีให้ order by ตาม ชื่อด้านต่าง ๆ
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultImprovePK4SQL = (record) => {
  var conditionYear = ''
  if (record.strYear) {
    conditionYear = `AND b.year = ${record.strYear}`
  }
  return new Promise((resolve, reject) => {
    const query = `	SELECT  a.*, b.UserID
      FROM Result_End_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      INNER JOIN (
     	  SELECT H.*, Q.id AS Q_id 
        FROM Result_High_Risk H 
     	  INNER JOIN Result_QR Q ON H.ResultQRID = Q.id
      ) E ON a.ResultDocID = Q_id
	    WHERE a.descResultEndQR IS NOT NULL AND a.descResultEndQR <> ''
      AND c.id = ${record.userId}
      ${conditionYear}
      ORDER BY a.head_id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultPK5FixSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.id, a.headRisk, a.objRisk, a.risking, a.improvementControl, a.responsibleAgency, a.progressControl, a.solutionsControl ,b.id as UserID, c.OPSideName , c.id as OPSideID
      FROM Result_PK5_Fix as a
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Sides as c ON a.OPSideID = c.id
      WHERE b.id = ${record.userId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConPK5SQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID, c.shortName
      FROM Result_CON_PK5 as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConPKF5SQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID, c.shortName
      FROM Result_CON_PKF5 as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetUserControlSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, shortName, userRole 
      FROM Users
      WHERE userRole = 'user' AND isActive = 1
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultCaseRiskSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.id, a.OPM_Desc, b.UserID
      FROM OPM as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId} AND b.OPSideID = ${record.sideId}
      AND a.isActive = 1
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultCollationSQL = (record) => {
  var conditionUserDoc = ''
  var conditionSendUser = ''
  var conditionStatus = ''
  if (record.userId) {
    conditionUserDoc = `AND c.id = ${record.userId}`
  }
  if (record.sendId) {
    conditionSendUser = `AND a.SendUserID = ${record.sendId}`
  }
  if (record.status) {
    conditionStatus = `AND b.OPStatusID = '${record.status}'`
  }
  return new Promise((resolve, reject) => {
    const query = `
      SELECT a.id , a.ResultDocID, a.SendUserID, a.fileName, a.fileData, b.OPStatusID, CAST(a.updatedAt AS CHAR) as updatedAt,
      c.shortName as receiveName, d.shortName AS sendName, b.id as userDocID
      FROM Result_Collation as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      INNER JOIN Users as d ON a.SendUserID = d.id
      WHERE b.OPFormID = 1 AND a.isActive = 1
      ${conditionUserDoc}
      ${conditionSendUser}
      ${conditionStatus}
      ORDER BY a.id;
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultDocPK6SQL = (record) => {
  var conditionUnitName = ''
  if (record.unitId) {
    conditionUnitName = `AND b.id = ${record.unitId}`
  }
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        a.id,
        a.year,
        a.comment,
        a.UserID,
        a.OPStatusID,
        a.OPFormID,
        CAST(a.updatedAt AS CHAR) as updatedAt,
        b.shortName as receiveName,
        c.OPFormName,
        d.OPStatusName
      FROM Result_UserDoc as a
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Form as c ON a.OPFormID = c.id
      INNER JOIN OP_Status as d ON a.OPStatusID = d.id
      WHERE a.OPFormID = 8
      ${conditionUnitName}
      ORDER BY a.id;
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultPK6SQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
          SELECT a.id, a.descRisk, a.descImprovements, a.detailsPK6, b.UserID
          FROM Result_PK6 as a
          INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
          INNER JOIN Users as c ON b.UserID = c.id
          WHERE b.id = ${record.userId}
          ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultConPK6SQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID, c.shortName
      FROM Result_CON_PK6 as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      INNER JOIN Users as c ON b.UserID = c.id
      WHERE c.id = ${record.userId}
      ORDER BY a.id
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnGetResultStatusDocUserSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
      WITH RankedStatus AS (
        SELECT 
              a.UserID,
              a.OPSideID,
              a.OPStatusID,
              ROW_NUMBER() OVER(PARTITION BY a.OPSideID ORDER BY a.OPStatusID DESC) AS rank_status
          FROM 
              Result_UserDoc AS a
          INNER JOIN 
              Users AS b ON a.UserID = b.id
          WHERE 
              a.OPStatusID IN (1, 2, 3, 4)
              and a.UserID BETWEEN 2 AND 43
              and a.OPSideID BETWEEN 2 AND 11
              and a.UserID = ${record.userId}
              order by a.UserID
      )
      SELECT 
        UserID,
        COUNT(CASE WHEN OPStatusID = 1 THEN 1 END) AS notprocess,
        COUNT(CASE WHEN OPStatusID = 2 THEN 1 END) AS process,
        COUNT(CASE WHEN OPStatusID = 3 THEN 1 END) AS incomplete,
        COUNT(CASE WHEN OPStatusID = 4 THEN 1 END) AS success
      FROM 
          RankedStatus
      WHERE 
          rank_status = 1
      GROUP BY 
          UserID;
    `;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

const fnUpdateCommentForAdminSQL = (data) => {
  return new Promise((resolve, reject) => {
    if (!data || !data.idUserDoc || !data.username || !data.comment) {
      return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
    }
      const query = `
        UPDATE Result_UserDoc SET comment = ?, OPStatusID = 3, updatedBy = ? WHERE id = ? 
      `;
      const params = [data.comment, data.username, data.idUserDoc];
      pool.query(query, params, (err, result) => {
        if (err) {
            // ส่งข้อความข้อผิดพลาดที่ชัดเจน
            reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
        } else {
            resolve(result);
        }
      });
  });
};

const fnUpdateStatusDocAdminSQL = (data) => {
  return new Promise((resolve, reject) => {
    if (!data || !data.idUserDoc || !data.username) {
      return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
    }
      const query = `
        UPDATE Result_UserDoc SET OPStatusID = 4, updatedBy = ? WHERE id = ? 
      `;
      const params = [data.username, data.idUserDoc];
      pool.query(query, params, (err, result) => {
        if (err) {
            // ส่งข้อความข้อผิดพลาดที่ชัดเจน
            reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
        } else {
            resolve(result);
        }
      });
  });
};

const fnCheckCollationFileDocPDFSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT id, fileName, fileData 
        FROM Result_Collation as a 
        WHERE id = '${record.collationId}'
    `;
    pool.query(query, [record], (err, results) => {
      
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
};

const fnUpdateCollationFileDocPDFSQL = (data) => {
  return new Promise((resolve, reject) => {
      if (!data || !data.fileName || !data.image || !data.username || !data.collationId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
          UPDATE Result_Collation SET fileName = ?, fileData = ?, updatedBy = ? WHERE id = ?
      `;
      const params = [data.fileName, Buffer.from(data.image, 'base64'), data.username , data.collationId];
      pool.query(query, params, (err, result) => {
        if (err) {
            // ส่งข้อความข้อผิดพลาดที่ชัดเจน
            reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
        } else {
            resolve(result);
        }
      });
  });
};

const fnUpdateStatusDocCollationSQL = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.username || !data.userDocId) {
      return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
    }
      const query = `
        UPDATE Result_UserDoc SET OPStatusID = 4, updatedBy = ? 
        WHERE id = ? AND OPFormID = 1
      `;
      const params = [data.username, data.userDocId];
      pool.query(query, params, (err, result) => {
        if (err) {
            // ส่งข้อความข้อผิดพลาดที่ชัดเจน
            reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
        } else {
            resolve(result);
        }
      });
  });
};



module.exports = {
  fnUpdateCommentForAdminSQL,
  fnUpdateStatusDocAdminSQL,

  fnCreateTableSQL,
  fnCheckRecordExistsSQL,
  fnInsertRecordSQL,
  fnGetResultDocSQL,
  fnGetResultDocConditionSQL,
  fnGetResultQRSQL,
  fnGetResultOPMSQL,
  // fnGetResultPFM_EVSQL,
  fnGetResultEndQRSQL,
  fnUpdateResultEndQRSQL,
  fnInsertResultEndQRSQL,

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
  fnGetUserControlSQL,

  fnGetResultCollationSQL,

  fnGetResultDocPK6SQL,
  fnGetResultPK6SQL,
  fnGetResultConPK6SQL,

  fnGetResultStatusDocUserSQL,

  fnCheckCollationFileDocPDFSQL,
  fnUpdateCollationFileDocPDFSQL,
  fnUpdateStatusDocCollationSQL

};