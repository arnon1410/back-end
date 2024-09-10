const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

  const fnUpdateDataNameUnitPFMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.nameUnit || !data.username  || !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_PFM_EV SET nameUnit = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.nameUnit, data.username, data.idConPFM , data.userDocId];
  
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
  
  const fnInsertDataNameUnitPFMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.nameUnit || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_PFM_EV (ResultDocID, nameUnit, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, 1)
        `;
        const params = [data.userDocId, data.nameUnit, data.username, data.username];
  
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

  const fnUpdateFormPerformanceSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || !data.activityControl || !data.improvementControl || !data.username || !data.idPFM || !data.idQR) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_PFM_EV SET activityControl = ?, improvementControl= ?, updatedBy = ? WHERE id = ? AND ResultQRID = ? 
        `;
        const params = [data.activityControl, data.improvementControl, data.username, data.idPFM, data.idQR];
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

 const fnUpdateStatusDocPFMSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.username || !data.userId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_UserDoc SET OPStatusID = 2, updatedBy = ? 
          WHERE UserID = ? AND OPSideID = ? AND OPFormID = 4
        `;
        const params = [data.username, data.userId , data.sideId];
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

 const fnUpdateChanceRiskModalSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.idPFM || !data.username || !data.frequencyLV1 || !data.frequencyLV2 || !data.frequencyLV3 || !data.frequencyLV4 || !data.frequencyLV5 || !data.chanceRiskScore  ) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
            UPDATE Result_ChanceRisk SET frequencyLV1 = ?, frequencyLV2 = ?, frequencyLV3 = ?, frequencyLV4 = ?, frequencyLV5 = ?, chanceRiskScore = ?, updatedBy = ?
            WHERE ResultPFM_EV_ID = ?
        `;
        const params = [data.frequencyLV1, data.frequencyLV2 , data.frequencyLV3, data.frequencyLV4, data.frequencyLV5 , data.chanceRiskScore,  data.username,  data.idPFM];
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

 const fnUpdateEffectRiskModalSQL = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.idPFM || !data.username || !data.damageLV1 || !data.damageLV2 || !data.damageLV3 || !data.damageLV4 || !data.damageLV5 || !data.effectRiskScore) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_EffectRisk SET damageLV1 = ?, damageLV2 = ?, damageLV3 = ?, damageLV4 = ?, damageLV5 = ?, effectRiskScore = ?, updatedBy = ?
          WHERE ResultPFM_EV_ID = ?
        `;
        const params = [data.damageLV1, data.damageLV2 , data.damageLV3, data.damageLV4, data.damageLV5 , data.effectRiskScore,  data.username,  data.idPFM];
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

 const fnUpdateResultPFMEVSQL = (data) => {
    return new Promise((resolve, reject) => {
        let strSelect = ''
        let strValue = ''
        if (!data.idPFM || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        if (data.chanceRiskScore && data.type == 'chanceRisk') {
            strSelect = 'chanceRiskScore'
            strValue = data.chanceRiskScore
        } else if (data.effectRiskScore && data.type == 'effectRisk') {
            strSelect = 'effectRiskScore'
            strValue = data.effectRiskScore
        } else { // data.type == 'rankRisk'
            strSelect = 'rankRiskScore'
            strValue = data.rankRiskScore
        }
        const strRankRiskScore = data.rankRiskScore ? data.rankRiskScore : null
        const query = `
          UPDATE Result_PFM_EV SET ${strSelect} = ?, rankRiskScore = ?, updatedBy = ?
          WHERE id = ?
        `;
        const params = [strValue, strRankRiskScore,  data.username,  data.idPFM];
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
 
 const fnUpdateResultHighRiskSQL = (data) => {
    return new Promise((resolve, reject) => {
        if (!data.idPFM || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }

        const activityControl = data.activityControl !== undefined && data.activityControl !== "" ? data.activityControl : null;
        const improvementControl = data.improvementControl !== undefined && data.improvementControl !== "" ? data.improvementControl : null;
        let isActive =  '1'
        if (data.rankRiskScore < 8) {
            isActive =  '0'
        } 
        
        const query = `
            UPDATE Result_High_Risk 
            SET existingControl = ?, improvementControl = ?, isActive = ?, updatedBy = ?
            WHERE ResultQRID = ?
        `;
        
        const params = [
            activityControl,
            improvementControl,
            isActive,
            data.username,
            data.idQR
        ];
        
        pool.query(query, params, (err, result) => {
            if (err) {
                reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
            } else {
                resolve(result);
            }
        });
    });
 };

 const fnInsertResultHighRiskSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.idQR || !data.headRisk || !data.objRisk || !data.risking || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }

        // แก้ไขการตรวจสอบเงื่อนไข
        const activityControl = data.activityControl === "" ? null : data.activityControl;
        const improvementControl = data.improvementControl === "" ? null : data.improvementControl;

        const query = `
          INSERT INTO Result_High_Risk (ResultQRID, headRisk, objRisk, risking, existingControl, improvementControl, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const params = [
            parseInt(data.idQR),
            data.headRisk, 
            data.objRisk, 
            data.risking, 
            activityControl, 
            improvementControl, 
            data.username, 
            data.username
        ];

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

const fnUpdateDataSignaturePFMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.signPath || !data.username , !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_PFM_EV SET signPath = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.signPath, data.username, data.idConPFM , data.userDocId];
  
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
  
const fnInsertDataSignaturePFMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userDocId || !data.signPath || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_PFM_EV (ResultDocID, signPath, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, 1)
        `;
        const params = [parseInt(data.userDocId, 10), data.signPath, data.username, data.username];
  
        pool.query(query, params, (err, result) => {
            if (err) {
                // ส่งข้อความข้อผิดพลาดที่ชัดเจน
                reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
            } else {
                resolve(result.insertId);
            }
        });
    });
};

const fnUpdateDataAssessorPFMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username , !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_PFM_EV SET prefixAsessor = ?, position = ?, dateAsessor = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.prefixAsessor, data.position, data.dateAsessor, data.username, data.idConPFM , data.userDocId];
  
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
  
const fnInsertDataAssessorPFMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userDocId || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_PFM_EV (ResultDocID, prefixAsessor, position, dateAsessor, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        const params = [parseInt(data.userDocId, 10), data.prefixAsessor, data.position, data.dateAsessor, data.username, data.username];
  
        pool.query(query, params, (err, result) => {
            if (err) {
                // ส่งข้อความข้อผิดพลาดที่ชัดเจน
                reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
            } else {
                resolve(result.insertId);
            }
        });
    });
};
 

  module.exports = {
    fnUpdateDataNameUnitPFMSQL,
    fnInsertDataNameUnitPFMSQL,
    fnUpdateFormPerformanceSQL,
    fnUpdateStatusDocPFMSQL,
    fnUpdateChanceRiskModalSQL,
    fnUpdateEffectRiskModalSQL,
    fnUpdateResultPFMEVSQL,
    fnUpdateResultHighRiskSQL,
    fnInsertResultHighRiskSQL,
    fnUpdateDataSignaturePFMSQL,
    fnInsertDataSignaturePFMSQL,
    fnUpdateDataAssessorPFMSQL,
    fnInsertDataAssessorPFMSQL
  };