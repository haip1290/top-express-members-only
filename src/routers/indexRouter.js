const { Router } = require("express");
const router = Router();
const indexController = require("../controllers/indexController");

router.get("/", indexController.index);
router.get("/register", indexController.getRegisterPage);
router.post("/register", indexController.register);
router.get("/login", indexController.getLoginPage);
router.post("/login", indexController.login);

module.exports = router;
