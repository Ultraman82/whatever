// const { Pool, Client } = require("mariadb");

const mariadb = require('mariadb');
const pool = mariadb.createPool({
  user: "pijanatijana",
  host: "newleaf.kr",
  password: "iLTcwoH7I",
  database: "pijanatijana",
  connectionLimit: 5
});

// const pool = new Pool({
//   user: "pijanatijana",
//   host: "192.168.0.6",

//   password: "aoeu",

// });
//   port: "5432",

//   database: "enland",


module.exports = pool;
