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
  var conditionWhere = ''
  if (record.isAdmin !== '1') { // ถ้าไม่ใช่ Admin 
    conditionWhere = `AND b.id = ${record.userId} AND c.id = ${record.sideId}`
  }
  return new Promise((resolve, reject) => {
    const query = `SELECT a.*, b.username, c.OPSideName, d.OPFormName, e.OPStatusName
      FROM Result_UserDoc as a 
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Sides as c ON a.OPSideID = c.id
      INNER JOIN OP_Form as d ON a.OPFormID = d.id
      INNER JOIN OP_Status as e ON a.OPStatusID = e.id 
      WHERE a.opSideID <> 1
      ${conditionWhere}
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
      conditionStatus = `AND e.OPStatusName = '${record.status}'`
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
    const query = `SELECT a.id , a.checkbox, a.descResultQR, b.UserID, c.fileName
      FROM Result_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      LEFT JOIN Result_File_QR as c ON a.id = c.ResultQRID
      WHERE b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId} AND b.OPFormID = 2
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

    const params = [record.userId, record.idQR];
    
    pool.query(query, params, (err, results) => {
      if (err) {
        reject(new Error(`SQL Error: ${err.message}`));
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
};

// const fnGetResultPFM_EVSQL = (record) => {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT id, headRisk, objRisk, risking FROM Result_PFM_EV 
//       WHERE ResultDocID = ? 
//       AND ResultQRID = ? 
//       AND isActive = 1
//       AND YEAR(updatedAt) = YEAR(CURDATE())
//     `;

//     const params = [record.userId, record.idQR];
    
//     pool.query(query, params, (err, results) => {
//       if (err) {
//         reject(new Error(`SQL Error: ${err.message}`));
//       } else {
//         resolve(results.length ? results : null);
//       }
//     });
//   });
// };


const fnGetResultEndQRSQL = (record) => {
  var conditionOther = ''
  var conditionSpecific = ''
  if (record.otherId) {
    conditionOther = `AND a.OtherID = ${record.otherId}`
  }

  if (record.idEndQR) {
    conditionSpecific = `AND a.id = ${record.idEndQR}`
  }
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.head_id, a.radio, a.descResultEndQR, b.UserID
      FROM Result_End_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
      ${conditionOther}
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

const fnUpdateResultEndQRSQL = (data) => {
  return new Promise((resolve, reject) => {
      // ตรวจสอบว่า data มีค่าที่ต้องการ
      if (!data || !data.radio || !data.descResultEndQR || !data.username || !data.idEndQR) {
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
      if (!data || !data.userId || !data.head_id || !data.descResultEndQR || !data.username) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
        INSERT INTO Result_End_QR (ResultDocID, head_id, radio, descResultEndQR, createdBy, updatedBy, isActive)
        VALUES (?, ?, ?, ?, ?, ?, 1)
      `;
      const params = [data.userId, data.head_id, data.radio, data.descResultEndQR, data.username, data.username];

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
      WHERE b.UserID = ? AND b.OPSideID = ?
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
      WHERE c.OtherID IS NOT NULL 
      AND b.UserID = ? AND b.OPSideID = ?
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
      WHERE b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
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
    const query = `SELECT a.id, a.ResultDocID, a.descResultASM, b.UserID
      FROM Result_ASM as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE a.ResultDocID = ${record.userId} AND b.OPSideID = ${record.sideId}
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
      WHERE b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
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
    const query = `SELECT a.id , a.ResultQRID, a.headRisk , a.objRisk, a.risking, a.activityControl, a.chanceRiskScore , a.effectRiskScore, a.rankRiskScore, a.improvementControl, b.UserID
      FROM Result_PFM_EV as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
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

const fnGetResultConPFMEVSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.nameUnit, a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID
      FROM Result_CON_PFM_EV as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
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
    const query = `SELECT a.id, a.frequencyLV1, a.frequencyLV2, a.frequencyLV3, a.frequencyLV4, a.frequencyLV5, a.chanceRiskScore, b.UserID
      FROM Result_ChanceRisk as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE a.ResultPFM_EV_ID = ${record.PFM_EVId} AND b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
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
    const query = `SELECT a.id, a.damageLV1, a.damageLV2, a.damageLV3, a.damageLV4, a.damageLV5, a.effectRiskScore, b.UserID
      FROM Result_EffectRisk as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE a.ResultPFM_EV_ID = ${record.PFM_EVId} AND b.UserID = ${record.userId} AND b.OPSideID = ${record.sideId}
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
    const query = `SELECT a.id, a.ResultDocID, a.descResultPK4 , b.UserID
      FROM Result_PK4 as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId}
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
      WHERE b.UserID = ${record.userId}
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
      conditionYear = `AND b.year = ${record.strYear}`
    }
    if (record.idQR) { // กรณีที่ UPDATE 
      conditionIdQR = `AND a.ResultQRID = ${record.idQR}`
    } else {
      conditionIdQR = `AND a.isActive = 1 `
    }
    const query = `SELECT a.id, a.ResultQRID, a.headRisk, a.objRisk, a.risking, a.existingControl, a.evaluationControl,
      a.existingRisk, a.improvementControl, a.responsibleAgency,a.progressControl, a.solutionsControl,
      b.UserID, b.OPSideID
      FROM Result_High_Risk as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId}
      ${conditionYear}
      ${conditionIdQR}
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

const fnGetResultPK5FixSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.responsibleAgency, b.UserID
      FROM Result_PK5_Fix as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId}
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
      WHERE b.UserID = ${record.userId}
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
      WHERE b.UserID = ${record.userId}
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
  fnGetResultPFMEVSQL,
  fnGetResultConPFMEVSQL,
  fnGetResultChanceRiskSQL,
  fnGetResultEffectRiskSQL,
  fnGetResultPK4SQL,
  fnGetResultConPK4SQL,
  fnGetResultHighRiskSQL,
  fnGetResultConPK5SQL,
  fnGetResultPK5FixSQL,
  fnGetResultConPKF5SQL,
  fnGetUserControlSQL,

};