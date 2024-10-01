const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const fnUpdateDataNameUnitASMSQL = (data) => {
  return new Promise((resolve, reject) => {
      // ตรวจสอบว่า data มีค่าที่ต้องการ
      if (!data || !data.nameUnit || !data.username  || !data.userDocId) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
      const query = `
          UPDATE Result_CON_ASM SET nameUnit = ?, updatedBy = ? 
          WHERE id = ? AND ResultDocID = ?
      `;
      const params = [data.nameUnit, data.username, data.idConASM , data.userDocId];

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
      const params = [data.userDocId, data.nameUnit, data.username, data.username];

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

const fnUpdateFormAssessmentSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data || !data.descResultASM || !data.username || !data.idASM || !data.userDocId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_ASM SET descResultASM = ?, updatedBy = ? WHERE id = ? AND ResultDocID = ? 
        `;
        const params = [data.descResultASM, data.username, data.idASM, data.userDocId];
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
      if (!data || !data.descResultConASM || !data.username || !data.idConASM || !data.userDocId) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_CON_ASM SET descConASM = ?, updatedBy = ? WHERE id = ? AND ResultDocID = ? 
        `;
        const params = [data.descResultConASM, data.username, data.idConASM, data.userDocId];
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
const fnInsertConAssessmentSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userDocId || !data.descResultConASM || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_ASM (ResultDocID, descConASM, createdBy, updatedBy, isActive) 
          VALUES (?, ?, ?, ?, 1)
        `;
        const params = [parseInt(data.userDocId, 10), data.descResultConASM, data.username, data.username];
  
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
        if (!data || !data.signPath || !data.username , !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_ASM SET signPath = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.signPath, data.username, data.idConASM , data.userDocId];
  
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
        if (!data || !data.userDocId || !data.signPath || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_ASM (ResultDocID, signPath, createdBy, updatedBy, isActive) 
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

const fnUpdateDataAssessorASMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username , !data.userDocId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_ASM SET prefixAsessor = ?, position = ?, dateAsessor = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.prefixAsessor, data.position, data.dateAsessor, data.username, data.idConASM , data.userDocId];
  
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
        if (!data || !data.userDocId || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_ASM (ResultDocID, prefixAsessor, position, dateAsessor, createdBy, updatedBy, isActive) 
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
  fnUpdateDataNameUnitASMSQL,
  fnInsertDataNameUnitASMSQL,
  fnUpdateFormAssessmentSQL,
  fnUpdateConAssessmentSQL,
  fnInsertConAssessmentSQL,
  fnUpdateStatusDocASMSQL,
  fnUpdateDataSignatureASMSQL,
  fnInsertDataSignatureASMSQL,
  fnUpdateDataAssessorASMSQL,
  fnInsertDataAssessorASMSQL
  
};