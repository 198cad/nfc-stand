const mysql = require("mysql");

const sql = mysql.createPool({
  host: "168.168.168.124",
  user: "admin",
  password: "S!MRSGos2",
});

module.exports = sql;
