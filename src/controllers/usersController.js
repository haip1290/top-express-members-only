const usersQueries = require("../db/userQueries");

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

      try {
        console.log("calling users queries to change member status");
        await usersQueries.updateUserMemberStatusById(id, isMemberStatus);
        console.log("member status changed");
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
};

module.exports = usersController;
