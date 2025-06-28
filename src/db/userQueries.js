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

const getUserById = async (id) => {
  console.log("Getting user by id");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM members_only.users WHERE id = $1",
      [id],
    );
    console.log("User found ", rows.length);
    return rows[0];
  } catch (error) {
    console.log("Error getting user by id: ", error);
    throw error;
  }
};

const getUserByEmail = async (email) => {
  console.log("Getting user by email");
  try {
    const { rows } = await pool.query(
      "SELECT * FROM members_only.users WHERE email = $1",
      [email],
    );
    console.log("User found ", rows.length);
    return rows[0];
  } catch (error) {
    console.log("Error getting user by email: ", error);
    throw error;
  }
};

const updateUserMemberStatusById = async (id, isMemberStatus) => {
  console.log("Updating user member status");
  try {
    const { rowCount } = await pool.query(
      "update members_only.users set is_member = $1 where id = $2",
      [isMemberStatus, id],
    );
    console.log(`${rowCount} User updated`);
  } catch (error) {
    console.log("Error updating user member status: ", error);
    throw error;
  }
};

const updateUserIsAdminById = async (id, isAdmin) => {
  console.log("Updating user to be admin");
  try {
    const { rowCount } = await pool.query(
      "update members_only.users set isadmin = $1 where id = $2",
      [isAdmin, id],
    );
    console.log(`${rowCount} User updated`);
  } catch (error) {
    console.log("Error updating user to be admin: ", error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserMemberStatusById,
  updateUserIsAdminById,
};
