const pool = require("./pool");

const createUser = async ({ firstName, lastName, email, hashedPassword }) => {
  console.log("Inserting user");
  try {
    const { rowCount } = await pool.query(
      "insert into members_only.users (first_name, last_name, email, password_hash) values ($1, $2, $3, $4)",
      [firstName, lastName, email, hashedPassword],
    );
    console.log(`${rowCount} User inserted`);
  } catch (error) {
    console.log("Error inserting user: ", error);
    throw error;
  }
};

module.exports = {
  createUser,
};
