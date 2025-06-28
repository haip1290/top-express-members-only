const messageQueries = require("../db/messageQueries");
const asyncHandler = require("express-async-handler");

const messagesController = {
  createMessageGet: (req, res) => {
    const user = req.user;
    res.render("create-message", {
      title: "Create Message",
      user: user,
      errors: [],
    });
  },
  createMessagePost: [
    asyncHandler(async (req, res) => {
      const { title, content } = req.body;
      try {
        await messageQueries.createMessage({
          title,
          content,
          userId: req.user.id,
        });
        res.redirect("/");
      } catch (dbError) {
        console.log("Error creating message: ", dbError);
        res.redirect("/create-message");
      }
    }),
  ],
};

module.exports = messagesController;
