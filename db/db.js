const mysql = require("mysql2/promise"); // Using promises for a cleaner async approach
const config = require("./config");

const connectDB = async () => {
  try {
    const pool = await mysql.createPool(config);
    const connection = await pool.getConnection(); // Get a connection from the pool
    console.log("Connected to MySQL database");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error({ error: err.message }); // Handle connection error
  }
};

module.exports = connectDB;