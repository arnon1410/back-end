const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema")
const bcrypt = require("bcryptjs");
const {
  fnCreateTable,
  fnCheckRecordExists,
  fnInsertRecord,
  fnCreateTableSQL,
  fnCheckRecordExistsSQL,
  fnInsertRecordSQL,
} = require("../utils/sqlFunctions");

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const { username, password, unitName, shortName, userRole, createAt, isActive} = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "username or Password fields cannot be empty!" });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const data = {
    userId: uuidv4(),
    username,
    password: hashedPassword,
    unitName,
    shortName,
    userRole,
    isActive
  };
  try {
    await fnCreateTableSQL(userSchema);
    const userAlreadyExists = await fnCheckRecordExistsSQL("Users", "username", username);
    if (userAlreadyExists) {
      res.status(409).json({ error: "username already exists" });
    } else {
      await fnInsertRecordSQL("Users", data);
      res.status(201).json({ message: "User created successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    res
      .status(400)
      .json({ error: "username or Password fields cannot be empty!" });
    return;
  }

  try {
    const existingUser = await fnCheckRecordExistsSQL("Users", "username", username);

    if (existingUser) {
      if (!existingUser.password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (passwordMatch) {
        res.status(200).json({
          userId: existingUser.id,
          username: existingUser.username,
          access_token: generateAccessToken(existingUser.userId),
          unitName: existingUser.unitName,
          shortName: existingUser.shortName,
          userRole: existingUser.userRole,
          status: 'success'
        });
      } else {
        res.status(401).json({ error: "Invalid credentials", status: 'error' });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials", status: 'error' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message, status: 'error' });
  }
};

module.exports = {
  register,
  login,
};