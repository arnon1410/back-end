const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const fnUpdateFormPKF5SQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || !data.progressControl  || !data.solutionsControl || !data.username || !data.idPKF5 || !data.userDocId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
            UPDATE Result_High_Risk 
            SET progressControl = ?, solutionsControl = ?, updatedBy = ?
            WHERE id = ?
        `;
        
        const params = [
            parseInt(data.progressControl, 10),
            data.solutionsControl,
            data.username,
            data.idPKF5
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

const fnUpdateStatusDocPKF5SQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.username || !data.userId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
            UPDATE Result_UserDoc SET OPStatusID = 2, updatedBy = ? 
            WHERE UserID = ? AND OPSideID = 12 AND OPFormID = 7
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

const fnUpdateDataSignaturePKF5SQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.signPath || !data.username , !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_PKF5 SET signPath = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.signPath, data.username, data.idConPKF5 , data.userDocId];
  
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
  
const fnInsertDataSignaturePKF5SQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userDocId || !data.signPath || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_PKF5 (ResultDocID, signPath, createdBy, updatedBy, isActive) 
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

const fnUpdateDataAssessorPKF5SQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username , !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_PKF5 SET prefixAsessor = ?, position = ?, dateAsessor = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.prefixAsessor, data.position, data.dateAsessor, data.username, data.idConPKF5 , data.userDocId];
  
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
  
const fnInsertDataAssessorPKF5SQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userDocId || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_PKF5 (ResultDocID, prefixAsessor, position, dateAsessor, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        const params = [data.userDocId, data.prefixAsessor, data.position, data.dateAsessor, data.username, data.username];
  
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

const fnUpdateFormPKF5FixSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.progressControl  || !data.solutionsControl || !data.username || !data.idPKF5 || !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
          }
            const query = `
                UPDATE Result_PK5_Fix 
                SET progressControl = ?, solutionsControl = ?, updatedBy = ?
                WHERE id = ?
            `;
            const params = [
                parseInt(data.progressControl, 10),
                data.solutionsControl,
                data.username,
                data.idPKF5
            ];
  
        pool.query(query, params, (err, result) => {
            if (err) {
                console.log(err)
                // ส่งข้อความข้อผิดพลาดที่ชัดเจน
                reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
            } else {
                resolve(result);
            }
        });
    });
};

const fnInsertFormPKF5FixSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userId || !data.sideId || !data.headRisk || !data.objRisk || !data.risking || !data.improvement || !data.agentcy || !data.progress || !data.solution  || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_PK5_Fix (UserID, OPSideID, headRisk, objRisk, risking, improvementControl, responsibleAgency, progressControl, solutionsControl, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const params = [parseInt(data.userId, 10), parseInt(data.sideId, 10), data.headRisk, data.objRisk, data.risking, data.improvement, data.agentcy, data.progress, data.solution, data.username, data.username];
  
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
  fnUpdateFormPKF5SQL,
  fnUpdateStatusDocPKF5SQL,
  fnUpdateDataSignaturePKF5SQL,
  fnInsertDataSignaturePKF5SQL,
  fnUpdateDataAssessorPKF5SQL,
  fnInsertDataAssessorPKF5SQL,
  fnUpdateFormPKF5FixSQL,
  fnInsertFormPKF5FixSQL
};