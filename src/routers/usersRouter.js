const { Router } = require("express");
const router = Router();
const messagesController = require("../controllers/messagesController");
const usersController = require("../controllers/usersController");
const { isAuthenticated } = require("../authentication/utils");

router.get(
  "/:userId/create-message",
  isAuthenticated,
  messagesController.createMessageGet,
);
router.post(
  "/:userId/create-message",
  isAuthenticated,
  messagesController.createMessagePost,
);

router.get(
  "/:userId/join-club",
  isAuthenticated,
  usersController.getJoinClubPage,
);

router.post(
  "/:userId/join-club",
  isAuthenticated,
  usersController.changeMemberStatus,
);

module.exports = router;
