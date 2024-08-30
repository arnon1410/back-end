const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const fnUpdateDataNameUnitASMSQL = (data) => {
  return new Promise((resolve, reject) => {
      // ตรวจสอบว่า data มีค่าที่ต้องการ
      if (!data || !data.nameUnit || !data.username  || !data.userId) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
          UPDATE Result_CON_ASM SET nameUnit = ?, updatedBy = ? 
          WHERE id = ? AND ResultDocID = ?
      `;
      const params = [data.nameUnit, data.username, data.idConASM , data.userId];

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

const fnInsertDataNameUnitASMSQL = (data) => {
  return new Promise((resolve, reject) => {
      // ตรวจสอบว่า data มีค่าที่ต้องการ
      if (!data || !data.nameUnit || !data.username) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
        INSERT INTO Result_CON_ASM (ResultDocID, nameUnit, createdBy, updatedBy, isActive) 
        VALUES (?, ?, ?, ?, 1)
      `;
      const params = [data.userId, data.nameUnit, data.username, data.username];

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

const fnUpdateFormAssessmentSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || !data.descResultASM || !data.username || !data.idASM || !data.userId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_ASM SET descResultASM = ?, updatedBy = ? WHERE id = ? AND ResultDocID = ? 
        `;
        const params = [data.descResultASM, data.username, data.idASM, data.userId];
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

const fnUpdateConAssessmentSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || !data.descResultConASM || !data.username || !data.idConASM || !data.userId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_CON_ASM SET descConASM = ?, updatedBy = ? WHERE id = ? AND ResultDocID = ? 
        `;
        const params = [data.descResultConASM, data.username, data.idConASM, data.userId];
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


const fnUpdateStatusDocASMSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.username || !data.userId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_UserDoc SET OPStatusID = 2, updatedBy = ? 
          WHERE UserID = ? AND OPSideID = ? AND OPFormID = 3
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

const fnUpdateDataSignatureASMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.signPath || !data.username , !data.userId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_ASM SET signPath = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.signPath, data.username, data.idConASM , data.userId];
  
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
  
const fnInsertDataSignatureASMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userId || !data.signPath || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_ASM (ResultDocID, signPath, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, 1)
        `;
        const params = [parseInt(data.userId, 10), data.signPath, data.username, data.username];
  
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

const fnUpdateDataAssessorASMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username , !data.userId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_ASM SET prefixAsessor = ?, position = ?, dateAsessor = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.prefixAsessor, data.position, data.dateAsessor, data.username, data.idConASM , data.userId];
  
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
  
const fnInsertDataAssessorASMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userId || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_ASM (ResultDocID, prefixAsessor, position, dateAsessor, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `;
        const params = [parseInt(data.userId, 10), data.prefixAsessor, data.position, data.dateAsessor, data.username, data.username];
  
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
  fnUpdateDataNameUnitASMSQL,
  fnInsertDataNameUnitASMSQL,
  fnUpdateFormAssessmentSQL,
  fnUpdateConAssessmentSQL,
  fnUpdateStatusDocASMSQL,
  fnUpdateDataSignatureASMSQL,
  fnInsertDataSignatureASMSQL,
  fnUpdateDataAssessorASMSQL,
  fnInsertDataAssessorASMSQL
  
};