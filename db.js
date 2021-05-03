const { Pool } = require("pg");

const pool = new Pool({
  user: "nodellie",
  password: "orJKX2O6{Ii)61qvquqjcuns",
  host: "localhost",
  port: 5432,
  database: "enland",
});

module.exports = pool;

// const { Client } = require("pg");
// var connectionString = "postgres://postgres:postgres@localhost:5432/database";
// const client = new Client({
//   connectionString: connectionString,
// });
20;
