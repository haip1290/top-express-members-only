const pool = require("./pool");

const createMessage = async ({ title, content, userId }) => {
  console.log("inserting message");
  try {
    const { rowCount } = await pool.query(
      "insert into members_only.messages (title, content, user_id) values ($1, $2, $3)",
      [title, content, userId],
    );
    console.log(`${rowCount} message inserted`);
  } catch (error) {
    console.log("Error inserting message: ", error);
    throw error;
  }
};
const getMessagesByPageAndLimit = async ({ page, limit }) => {
  // validate page and limit before use
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const defaultPage = 1;
  const defaultLimit = 10;
  const actualPage =
    isNaN(pageNumber) || pageNumber <= 0 ? defaultPage : pageNumber;
  const actualLimit =
    isNaN(limit) || limitNumber <= 0 ? defaultLimit : limitNumber;

  // offset for page 1 is 0, page 2 is (2-1)*10 = 10;
  const offset = (actualPage - 1) * actualLimit;

  console.log(`getting messages for page ${actualPage} limit ${actualLimit}`);
  try {
    const { rows, rowCount } = await pool.query(
      "select * from members_only.messages order by created_at desc limit $1 offset $2",
      [actualLimit, offset],
    );
    console.log(`queries ${rowCount} rows of messages`);
    return rows;
  } catch (error) {
    console.log("Error inserting messages from server");
    throw error;
  }
};

module.exports = { createMessage, getMessagesByPageAndLimit };
