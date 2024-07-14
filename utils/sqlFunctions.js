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

const fnGetResultQRSQL = (record) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT a.id , a.checkbox, a.fileName, a.fileSave, a.filePath, a.descResultQR, b.UserID
      FROM Result_QR as a 
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

module.exports = {
  fnCreateTableSQL,
  fnCheckRecordExistsSQL,
  fnInsertRecordSQL,
  fnGetResultDocSQL,
  fnGetResultQRSQL
};