// config.js
const config = {
  
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 20, // Set the connection limit to 20
  queueLimit: 0, // Unlimited queue for pending connections
  flags: '-MAX_ALLOWED_PACKET=64M' // Adjust the packet size as needed (e.g., 64M)
};

module.exports = config;