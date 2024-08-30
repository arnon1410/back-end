const mysql = require("mysql");
const config = require("../db/config");
const pool = mysql.createPool(config);

const fnUpdateResultQRSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.checkbox || !data.descResultQR || !data.username || !data.idQR) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_QR SET checkbox = ?, descResultQR = ?, updatedBy = ? WHERE id = ?
        `;
        const params = [data.checkbox , data.descResultQR , data.username, data.idQR];
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
  
  const fnUpdateResultOPMSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.headName || !data.objName || !data.descResultQR || !data.username || !data.userId || !data.idQR) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE OPM SET OPM_Name = ?, OPM_Objective = ?, OPM_Desc = ?, updatedBy = ? 
            WHERE ResultDocID = ? AND ResultQRID = ?
        `;
        const params = [data.headName, data.objName, data.descResultQR, data.username, data.userId, data.idQR];
  
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
  
//   const fnInsertResultOPMSQL = (data) => {
//     return new Promise((resolve, reject) => {
//         // ตรวจสอบว่า data มีค่าที่ต้องการ
//         if (!data || !data.userId || !data.idQR || !data.headName || !data.objName || !data.descResultQR || !data.username) {
//             return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
//         }
//         const query = `
//           INSERT INTO OPM (ResultDocID, ResultQRID, OPM_Name, OPM_Objective, OPM_Desc, createdBy, updatedBy, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
//         `;
//         const params = [data.userId, data.idQR, data.headName, data.objName, data.descResultQR, data.username, data.username];
  
//         pool.query(query, params, (err, result) => {
//             if (err) {
//                 // ส่งข้อความข้อผิดพลาดที่ชัดเจน
//                 reject(new Error(`เกิดข้อผิดพลาดในการอัปเดตฐานข้อมูล: ${err.message}`));
//             } else {
//                 resolve(result);
//             }
//         });
//     });
//   };
  
  const fnUpdateResultPFM_EV = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.headName || !data.objName || !data.descResultQR || !data.username || !data.idQR) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_PFM_EV SET headRisk = ?, objRisk = ?, risking = ?, updatedBy = ? 
            WHERE ResultDocID = ? AND ResultQRID = ?
        `;
        const params = [data.headName, data.objName, data.descResultQR, data.username, data.idQR];
  
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
  
  const fnSetResultRiskSQL = (data) => {
    return new Promise((resolve, reject) => {
        const queryOPM = `
            INSERT INTO OPM (ResultDocID, ResultQRID, OPM_Name, OPM_Objective, OPM_Desc, createdBy, updatedBy, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const paramsOPM = [
            parseInt(data.userId, 10),
            parseInt(data.idQR, 10),
            data.headName,
            data.objName,
            data.descResultQR,
            data.username,
            data.username

        ];
  
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Connection error:', err);
                return reject(new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้'));
            }
  
            connection.beginTransaction(err => {
                if (err) {
                    console.error('Transaction error:', err);
                    connection.release();
                    return reject(new Error('ไม่สามารถเริ่มต้น transaction ได้'));
                }
  
                connection.query(queryOPM, paramsOPM, (err, resultOPM) => {
                    if (err) {
                        console.error('Query OPM error:', err);
                        return connection.rollback(() => {
                            connection.release();
                            reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูลลง OPM: ${err.message}`));
                        });
                    }

                    const strOPM_ID = resultOPM.insertId; // เก็บค่า id ที่ได้จากการ insert ลง OPM
                    // console.log('Insert ID from OPM:', strOPM_ID);

                    const queryPFM_EV = `
                        INSERT INTO Result_PFM_EV (ResultDocID, ResultQRID, OPM_ID, headRisk, objRisk, risking, createdBy, updatedBy, isActive)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
                    `;
                    const paramsPFM_EV = [
                        parseInt(data.userId, 10),
                        parseInt(data.idQR, 10),
                        parseInt(strOPM_ID),  // ใช้ id จากการ insert ลง OPM
                        data.headName,
                        data.objName,
                        data.descResultQR,
                        data.username,
                        data.username
                    ];

                    connection.query(queryPFM_EV, paramsPFM_EV, (err, resultPFM_EV) => {
                        if (err) {
                            console.error('Query PFM_EV error:', err);
                            return connection.rollback(() => {
                                connection.release();
                                reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูลลง Result_PFM_EV: ${err.message}`));
                            });
                        }

                        const strPFM_EV = resultPFM_EV.insertId; // เก็บค่า id ที่ได้จากการ insert ลง Result_PFM_EV
                        console.log('Insert ID from queryPFM_EV:', strPFM_EV);

                        const queryChanceRisk = `
                            INSERT INTO Result_ChanceRisk (ResultDocID, ResultPFM_EV_ID, createdBy, updatedBy, isActive)
                            VALUES (?, ?, ?, ?, 1)
                        `;
                        const paramsChanceRisk = [
                            parseInt(data.userId, 10),
                            parseInt(strPFM_EV, 10),
                            data.username,
                            data.username
                        ];

                        connection.query(queryChanceRisk, paramsChanceRisk, (err, resultChanceRisk) => {
                            if (err) {
                                console.error('Query ChanceRisk error:', err);
                                return connection.rollback(() => {
                                    connection.release();
                                    reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูลลง Result_ChanceRisk: ${err.message}`));
                                });
                            }

                            const queryEffectRisk = `
                                INSERT INTO Result_EffectRisk (ResultDocID, ResultPFM_EV_ID, createdBy, updatedBy, isActive)
                                VALUES (?, ?, ?, ?, 1)
                            `;
                            const paramsEffectRisk = [
                                parseInt(data.userId, 10),
                                parseInt(strPFM_EV, 10),
                                data.username,
                                data.username
                            ];

                            connection.query(queryEffectRisk, paramsEffectRisk, (err, resultEffectRisk) => {
                                if (err) {
                                    console.error('Query EffectRisk error:', err);
                                    return connection.rollback(() => {
                                        connection.release();
                                        reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูลลง Result_EffectRisk: ${err.message}`));
                                    });
                                }

                                connection.commit(err => {
                                    if (err) {
                                        console.error('Commit error:', err);
                                        return connection.rollback(() => {
                                            connection.release();
                                            reject(new Error('ไม่สามารถ commit transaction ได้'));
                                        });
                                    }

                                    console.log('Transaction committed successfully.');
                                    connection.release();
                                    resolve({ message: 'All rows inserted successfully' });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
  };

  const fnUpdateResultOtherOPSubSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.descResultEndQR || !data.username || !data.idEndQR) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE OTHER_S_OP SET text = ?, updatedBy = ? 
            WHERE ResultDocID = ? AND ResultQRID = ?
        `;
        const params = [data.descResultEndQR , data.username, data.userId, data.idQR];
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
  
  const fnUpdateResultOPMSubSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.descResultEndQR || !data.username || !data.userId || !data.idQR) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE OPM SET OPM_Desc = ?, updatedBy = ? 
            WHERE ResultDocID = ? AND ResultQRID = ?
        `;
        const params = [data.descResultEndQR, data.username, data.userId, data.idQR];
  
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
  
  const fnUpdateResultPFM_EVSub = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.descResultEndQR || !data.username || !data.idQR) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_PFM_EV SET risking = ?, updatedBy = ? 
            WHERE ResultDocID = ? AND ResultQRID = ?
        `;
        const params = [data.descResultEndQR, data.username, data.userId, data.idQR];
  
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

  const fnUpdateResultConQRSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.descConQR || !data.username || !data.idConQR) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_Con_QR SET descConQR = ?, updatedBy = ? WHERE id = ?
        `;
        const params = [ data.descConQR , data.username, data.idConQR];
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
  
  const fnInsertResultConQRSQL = (data) => { // nameUnit ยังไม่ส่งมา
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userId || !data.idConQR || !data.head_id || !data.descConQR || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_Con_QR (ResultDocID, head_id, radio, descConQR, createdBy, updatedBy, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const params = [data.userId, data.head_id, data.radio, data.descConQR, data.username, data.username];
  
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

  const fnUpdateStatusDocQRSQL = (data) => {
    return new Promise((resolve, reject) => {
      if (!data.username || !data.userId ) {
        return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
      }
        const query = `
          UPDATE Result_UserDoc SET OPStatusID = 2, updatedBy = ? 
          WHERE UserID = ? AND OPSideID = ? AND OPFormID = 2
        `;
        const params = [data.username, data.userId, data.sideId];
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

  const fnSetQuestionOtherSQL = (data) => { // แก้ไปใชข้เทเบิ้ลจริง
    return new Promise((resolve, reject) => {
        const query1 = `
            INSERT INTO OTHER_OP (ResultDocID, id_control, head_id, mainControl_id, text, objectName, createdBy, updatedBy, isActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        `;
        const params1 = [
            parseInt(data.userId, 10), 
            parseInt(data.idControlHead, 10), 
            parseInt(data.headId, 10), 
            parseInt(data.headId, 10), 
            data.headText, 
            data.objectName, 
            data.username, 
            data.username
        ];
  
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Connection error:', err);
                return reject(new Error('ไม่สามารถเชื่อมต่อฐานข้อมูลได้'));
            }
  
            connection.beginTransaction(err => {
                if (err) {
                    console.error('Transaction error:', err);
                    connection.release();
                    return reject(new Error('ไม่สามารถเริ่มต้น transaction ได้'));
                }
  
                console.log('Executing query1:', query1, params1);
                connection.query(query1, params1, (err, result1) => {
                    if (err) {
                        console.error('Query1 error:', err);
                        return connection.rollback(() => {
                            connection.release();
                            reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูลลง OTHER_OP: ${err.message}`));
                        });
                    }
  
                    const strIdOther = result1.insertId; // เก็บค่า id ที่ได้จากการ insert ลง OTHER_OP
                    console.log('Insert ID from query1:', strIdOther);
  
                    const query2 = `
                        INSERT INTO Result_End_QR (ResultDocID, OtherID, head_id, radio, descResultEndQR, createdBy, updatedBy, isActive)
                        VALUES (?, ?, ?, '0', ?, ?, ?, 1)
                    `;
                    const params2 = [
                        parseInt(data.userId, 10), 
                        parseInt(strIdOther, 10), 
                        parseInt(data.headId, 10), 
                        data.descEndQR, 
                        data.username, 
                        data.username
                    ];
  
                    connection.query(query2, params2, (err, result2) => {
                        if (err) {
                            console.error('Query2 error:', err);
                            return connection.rollback(() => {
                                connection.release();
                                reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูลลง Result_End_QR: ${err.message}`));
                            });
                        }
  
                        const insertRows = (paramsSet) => {
                            return new Promise((resolve, reject) => {
                                const query3 = `
                                    INSERT INTO Result_QR (ResultDocID, OtherID, checkbox, descResultQR, createdBy, updatedBy, isActive, resultNo)
                                    VALUES (?, ?, 'n', ?, ?, ?, 1, ?)
                                `;
                                const params3 = [
                                    parseInt(paramsSet.params3[0], 10), 
                                    parseInt(strIdOther, 10), 
                                    paramsSet.params3[1], 
                                    paramsSet.params3[2], 
                                    paramsSet.params3[3], 
                                    paramsSet.params3[4]
                                ];
  
                                connection.query(query3, params3, (err, result3) => {
                                    if (err) return reject(`Result_QR: ${err.message}`);
  
                                    const strIdQR = result3.insertId;
  
                                    const query4 = `
                                        INSERT INTO OTHER_S_OP (ResultDocID, ResultQRID, OtherID, text, createdBy, updatedBy, isActive)
                                        VALUES (?, ?, ?, ?, ?, ?, 1)
                                    `;
                                    const params4 = [
                                        parseInt(paramsSet.params4[0], 10), 
                                        parseInt(strIdQR, 10), 
                                        parseInt(strIdOther, 10), 
                                        paramsSet.params4[1], 
                                        paramsSet.params4[2], 
                                        paramsSet.params4[3]
                                    ];
  
                                    connection.query(query4, params4, (err, result4) => {
                                        if (err) return reject(`OTHER_S_OP: ${err.message}`);
  
                                        const query5 = `
                                            INSERT INTO OPM (ResultDocID, ResultQRID, OPM_Name, OPM_Objective, OPM_Desc, createdBy, updatedBy, isActive)
                                            VALUES (?, ?, ?, ?, ?, ?, ?, 1)
                                        `;
                                        const params5 = [
                                            parseInt(paramsSet.params5[0], 10), 
                                            parseInt(strIdQR, 10), 
                                            paramsSet.params5[1], 
                                            paramsSet.params5[2], 
                                            paramsSet.params5[3], 
                                            paramsSet.params5[4], 
                                            paramsSet.params5[5]
                                        ];
  
                                        connection.query(query5, params5, (err, result5) => {
                                            if (err) return reject(`OPM: ${err.message}`);
  
                                            const strIdOPM = result5.insertId;
  
                                            const query6 = `
                                                INSERT INTO Result_PFM_EV (ResultDocID, ResultQRID, OPM_ID, headRisk, objRisk, risking, createdBy, updatedBy, isActive)
                                                VALUES (?, ?, ?, ?, ?, ?, ?, ? ,1)
                                            `;
                                            const params6 = [
                                                parseInt(paramsSet.params6[0], 10), 
                                                parseInt(strIdQR, 10), 
                                                parseInt(strIdOPM, 10), 
                                                paramsSet.params6[1], 
                                                paramsSet.params6[2], 
                                                paramsSet.params6[3], 
                                                paramsSet.params6[4], 
                                                paramsSet.params6[5]
                                            ];
  
                                            connection.query(query6, params6, (err, result6) => {
                                                if (err) return reject(`Result_PFM_EV: ${err.message}`);
                                                resolve({ result3, result4, result5, result6 });
                                            });
                                        });
                                    });
                                });
                            });
                        };
  
                        const paramsSet1 = {
                            params3: [data.userId, data.descSub, data.username, data.username, data.idControlSub],
                            params4: [data.userId, data.descSub, data.username, data.username],
                            params5: [data.userId, data.headText, data.objectName, data.descSub, data.username, data.username],
                            params6: [data.userId, data.headText, data.objectName, data.descSub, data.username, data.username]
                        };
  
                        insertRows(paramsSet1)
                            .then(() => {
                                if (data.idControlSub2 && data.subText2 && data.descSub2) {
                                    const paramsSet2 = {
                                        params3: [data.userId, data.descSub2, data.username, data.username, data.idControlSub2],
                                        params4: [data.userId, data.descSub2, data.username, data.username],
                                        params5: [data.userId, data.headText, data.objectName, data.descSub2, data.username, data.username],
                                        params6: [data.userId, data.headText, data.objectName, data.descSub2, data.username, data.username]
                                    };
                                    
                                    return insertRows(paramsSet2);
                                }
                            })
                            .then(() => {
                                connection.commit(err => {
                                    if (err) {
                                        console.error('Commit error:', err);
                                        return connection.rollback(() => {
                                            connection.release();
                                            reject(new Error('ไม่สามารถ commit transaction ได้'));
                                        });
                                    }
  
                                    console.log('Transaction committed successfully.');
                                    connection.release();
                                    resolve({ message: 'All rows inserted successfully' });
                                });
                            })
                            .catch(error => {
                                console.error('Insert error:', error);
                                connection.rollback(() => {
                                    connection.release();
                                    reject(new Error(`เกิดข้อผิดพลาดในการ insert ข้อมูล: ${error}`));
                                });
                            });
                    });
                });
            });
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
        if (!data || !data.fileName || !data.image || !data.username || !data.idQR) {
          return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_File_QR SET fileName = ?, fileData = ?, updatedBy = ? WHERE ResultQRID = ?
        `;
        const params = [data.fileName, Buffer.from(data.image, 'base64'), data.username , data.idQR];
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

  const fnUpdateDataSignatureQRSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.signPath || !data.username , !data.userId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_QR SET signPath = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.signPath, data.username, data.idConQR , data.userId];
  
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
  
const fnInsertDataSignatureQRSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userId || !data.signPath || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_QR (ResultDocID, signPath, createdBy, updatedBy, isActive) 
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

const fnUpdateDataAssessorQRSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username , !data.userId) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
            UPDATE Result_CON_QR SET prefixAsessor = ?, position = ?, dateAsessor = ?, updatedBy = ? 
            WHERE id = ? AND ResultDocID = ?
        `;
        const params = [data.prefixAsessor, data.position, data.dateAsessor, data.username, data.idConQR , data.userId];
  
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
  
const fnInsertDataAssessorQRSQL = (data) => {
    return new Promise((resolve, reject) => {
        // ตรวจสอบว่า data มีค่าที่ต้องการ
        if (!data || !data.userId || !data.prefixAsessor || !data.position || !data.dateAsessor || !data.username) {
            return reject(new Error('ข้อมูลที่จำเป็นไม่ครบถ้วน'));
        }
        const query = `
          INSERT INTO Result_CON_QR (ResultDocID, prefixAsessor, position, dateAsessor, createdBy, updatedBy, isActive) 
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
    fnUpdateResultQRSQL,
    fnUpdateResultOPMSQL,
    // fnInsertResultOPMSQL,
    fnUpdateResultPFM_EV,
    fnUpdateResultOtherOPSubSQL,
    fnUpdateResultOPMSubSQL,
    fnUpdateResultPFM_EVSub,
    fnSetResultRiskSQL,
    fnUpdateResultConQRSQL,
    fnInsertResultConQRSQL,
    fnUpdateStatusDocQRSQL,
    fnSetQuestionOtherSQL,
    fnCheckFileDocPDFSQL,
    fnUpdateFileDocPDFSQL,
    fnSetFileDocPDFSQL,
    fnUpdateDataSignatureQRSQL,
    fnInsertDataSignatureQRSQL,
    fnUpdateDataAssessorQRSQL,
    fnInsertDataAssessorQRSQL

  };