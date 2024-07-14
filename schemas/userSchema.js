const userSchema = `
  CREATE TABLE IF NOT EXISTS Users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      userId VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      unitName VARCHAR(255) NOT NULL,
      shortName VARCHAR(50) NOT NULL,
      userRole VARCHAR(50) NOT NULL,
      createAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      isActive BOOLEAN DEFAULT TRUE
  )
`;

module.exports = userSchema;