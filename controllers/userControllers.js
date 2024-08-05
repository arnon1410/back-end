const {
    fnGetUserControlSQL
} = require("../utils/sqlFunctions");

const fnGetUserControl = async (req, res) => {  
  const { username } = req.body;
    
  const data = { username };
  
  if (!username) {
      res
      .status(400)
      .json({ error: "username fields cannot be empty!" });
      return;
  }
    try {
    console.log("/api/user/fnGetUserControl");
      const resultUser = await fnGetUserControlSQL(data);
        if (resultUser && resultUser.length > 0) {
          const result = resultUser.map(resSQL => ({
              id: resSQL.id,
              shortName: resSQL.shortName,
              userRole: resSQL.userRole
            }));
          res.status(200).json(result);
      } else {
        res.status(404).json({ 
          message: "Data not found",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'error' });
    }
};

module.exports = {
    fnGetUserControl
};