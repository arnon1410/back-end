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
  return new Promise((resolve, reject) => {
    const query = `SELECT a.*, b.username, c.OPSideName, d.OPFormName, e.OPStatusName
      FROM Result_UserDoc as a 
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Sides as c ON a.OPSideID = c.id
      INNER JOIN OP_Form as d ON a.OPFormID = d.id
      INNER JOIN OP_Status as e ON a.OPStatusID = e.id 
      WHERE b.id = ${record.userId} AND c.id = ${record.sideId}
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
        CAST(a.updatedAt AS CHAR) as updatedAt,
        b.shortName,
        d.OPFormName,
        e.OPStatusName
      FROM Result_UserDoc as a 
      INNER JOIN Users as b ON a.UserID = b.id
      INNER JOIN OP_Sides as c ON a.OPSideID = c.id
      INNER JOIN OP_Form as d ON a.OPFormID = d.id
      INNER JOIN OP_Status as e ON a.OPStatusID = e.id 
      WHERE c.id = ${record.sideId} AND a.year = ${record.year}
      ${conditionUnitName}
      ${conditionStatus}
      /* ORDER BY OPFormID */
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
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.checkbox, a.descResultQR, b.UserID, c.fileName
      FROM Result_QR as a 
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      LEFT JOIN Result_File_QR as c ON a.id = c.ResultQRID
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

const fnGetResultEndQRSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.radio, a.descResultEndQR, b.UserID
      FROM Result_End_QR as a 
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

const fnGetResultConQRSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.descConQR,  a.prefixAsessor, a.signPath, a.position, CAST(a.dateAsessor AS CHAR) as dateAsessor, b.UserID
      FROM Result_CON_QR as a 
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

const fnGetResultASMSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id, a.ResultDocID, a.descResultASM, b.UserID
      FROM Result_ASM as a 
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
    const query = `SELECT a.id , a.headRisk , a.objRisk, a.risking, a.activityControl, a.chanceRiskScore , a.effectRiskScore, a.rankRiskScore, a.improvementControl, b.UserID
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
    if (record.strYear) {
      conditionYear = `AND b.year = ${record.strYear}`
    }
    const query = `SELECT a.id, a.ResultQRID, a.headRisk, a.objRisk, a.risking, a.existingControl, a.evaluationControl,
      a.existingRisk, a.activityControl, a.improvementControl, a.responsibleAgency,a.progressControl, a.solutionsControl,
      b.UserID, b.OPSideID
      FROM Result_High_Risk as a
      INNER JOIN Result_UserDoc as b ON a.ResultDocID = b.id
      WHERE b.UserID = ${record.userId}
      ${conditionYear}
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

const fnCheckFileDocPDFSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT b.id, b.fileName, b.fileData 
        FROM Result_QR as a 
        INNER JOIN Result_File_QR as b ON a.id = b.ResultQRID 
        WHERE b.ResultQRID = '${record.idQR}'
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

const fnUpdateFileDocPDFSQL = (data) => {
  return new Promise((resolve, reject) => {
      const query = `
          UPDATE Result_File_QR SET fileName = ?, fileData = ?, updatedBy = ? WHERE ResultQRID = ?
      `;
      const params = [data.fileName, Buffer.from(data.image, 'base64'), data.username , data.idQR];
      pool.query(query, params, (err, result) => {
          if (err) {
              reject(err);
          } else {
              resolve(result);
          }
      });
  });
};

const fnSetFileDocPDFSQL = (data) => {
  return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
          if (err) {
              return reject(err);
          }

          connection.beginTransaction((err) => {
              if (err) {
                  connection.release();
                  return reject(err);
              }

              const insertQuery = `
                  INSERT INTO Result_File_QR (ResultQRID, fileName, fileData, createdBy, updatedBy) VALUES (?, ?, ?, ?, ?)
              `;
              const insertParams = [data.idQR, data.fileName, Buffer.from(data.image, 'base64'), data.username, data.username];

              connection.query(insertQuery, insertParams, (err, result) => {
                  if (err) {
                      return connection.rollback(() => {
                          connection.release();
                          return reject(err);
                      });
                  }

                  const updateQuery = `
                      UPDATE Result_QR SET checkbox = 'y', updatedBy = ? WHERE id = ?
                  `;
                  const updateParams = [data.username, data.idQR];

                  connection.query(updateQuery, updateParams, (err, result) => {
                      if (err) {
                          return connection.rollback(() => {
                              connection.release();
                              return reject(err);
                          });
                      }

                      connection.commit((err) => {
                          if (err) {
                              return connection.rollback(() => {
                                  connection.release();
                                  return reject(err);
                              });
                          }
                          connection.release();
                          resolve(result);
                      });
                  });
              });
          });
      });
  });
};

module.exports = {
  fnCreateTableSQL,
  fnCheckRecordExistsSQL,
  fnInsertRecordSQL,
  fnGetResultDocSQL,
  fnGetResultDocConditionSQL,
  fnGetResultQRSQL,
  fnGetResultEndQRSQL,
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
  fnCheckFileDocPDFSQL,
  fnUpdateFileDocPDFSQL,
  fnSetFileDocPDFSQL
};