require("dotenv").config();
const { Client } = require("pg");

const SQL = "SELECT * FROM members_only.users";

const testDB = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
  try {
    console.log("Connecting to database");
    await client.connect();
    console.log("Querying database");
    const { rows } = await client.query(SQL);
    console.log("Result: ", rows);
  } catch (error) {
    console.log("Error: ", error);
  } finally {
    console.log("Closing connection");
    await client.end();
  }
};

testDB();
