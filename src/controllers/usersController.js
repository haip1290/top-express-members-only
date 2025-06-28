const usersQueries = require("../db/userQueries");
const messagesQueries = require("../db/messageQueries");

const usersController = {
  getJoinClubPage: (req, res) => {
    res.render("join-club", {
      title: "Join Club",
      user: req.user,
      errors: [],
    });
  },

  changeMemberStatus: async (req, res) => {
    console.log("changing member status");
    const secret = req.body.secret;
    if (secret === process.env.CLUB_SECRET) {
      const user = req.user;
      const id = user.id;
      const isMemberStatus = true;
      const isAdmin = req.body.isAdmin === "on";
      try {
        console.log("calling users queries to change member status");
        await usersQueries.updateUserMemberStatusById(id, isMemberStatus);
        console.log("member status changed");
        if (isAdmin) {
          await usersQueries.updateUserIsAdminById(id, isAdmin);
          console.log("user is admin status changed");
        }
        res.redirect("/");
      } catch (error) {
        console.log("error changing member status", error);
        res.redirect("/");
      }
    } else {
      res.render("join-club", {
        title: "Join Club",
        user: req.user,
        errors: [{ msg: "Invalid secret" }],
      });
    }
  },

  deleteMessage: async (req, res) => {
    const messageId = req.params.messageId;
    try {
      await messagesQueries.deleteMessageById(messageId);
      res.redirect("/");
    } catch (dbError) {
      console.log("Error deleting message: ", dbError);
      res.redirect("/");
    }
  },
};

module.exports = usersController;
