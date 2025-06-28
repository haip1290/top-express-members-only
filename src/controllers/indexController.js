const userQueries = require("../db/userQueries");
const messageQueries = require("../db/messageQueries");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const passport = require("../authentication/passport");
const { body, validationResult } = require("express-validator");

const emailErrMsg = "Please enter a valid email";
const pwLengthErrMsg =
  "Password must be at least 5 and at max 20 characters long";
const alphaErrMsg = " must contain only letters";
const requiredErrMsg = " is required";

const validateRegisterForm = [
  body("email").trim().isEmail().withMessage(emailErrMsg),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(`Password ${requiredErrMsg}`)
    .isLength({ min: 5, max: 20 })
    .withMessage(pwLengthErrMsg),
  body("confirmPw")
    .trim()
    .notEmpty()
    .withMessage(`Confirm password ${requiredErrMsg}`)
    .isLength({ min: 5, max: 20 })
    .withMessage(pwLengthErrMsg)
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("firstName")
    .trim()
    .isAlpha("en-US", { ignore: ["-", "'", " "] })
    .withMessage(`First name ${alphaErrMsg}`)
    .notEmpty()
    .withMessage(`First name ${requiredErrMsg}`),
  body("lastName")
    .trim()
    .isAlpha("en-US", { ignore: ["-", "'", " "] })
    .withMessage(`Last name ${alphaErrMsg}`)
    .notEmpty()
    .withMessage(`Last name ${requiredErrMsg}`),
];

const validateLoginForm = [
  body("email").trim().isEmail().withMessage(emailErrMsg),
  body("password")
    .trim()
    .isLength({ min: 5, max: 20 })
    .withMessage(pwLengthErrMsg),
];

const convertMessagesToDTO = async (messages, isMember) => {
  return await Promise.all(
    messages.map(async (message) => {
      let author = null;
      try {
        const user = await userQueries.getUserById(message.user_id);
        author = isMember
          ? `${user.first_name} ${user.last_name}`
          : "anonymous";
        return {
          id: message.id,
          title: message.title,
          content: message.content,
          createdAt: message.created_at,
          author: author,
        };
      } catch (error) {
        console.log("Error getting user by id: ", error);
        return {
          id: message.id,
          title: message.title,
          content: message.content,
          createdAt: message.created_at,
          author: null,
        };
      }
    }),
  );
};

const indexController = {
  index: async (req, res) => {
    const title = "Welcome to our clubhouse";
    const user = req.user;
    if (user) {
      try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;

        const messages = await messageQueries.getMessagesByPageAndLimit({
          page,
          limit,
        });

        const messagesDTO = await convertMessagesToDTO(
          messages,
          user.is_member,
        );

        console.log("messages: ", messagesDTO);
        res.render("index", {
          title: title,
          user: req.user,
          messages: messagesDTO,
          errors: [],
        });
      } catch (dbError) {
        console.log("error calling messages queries", dbError);
        res.render("index", {
          title: title,
          user: req.user,
          messages: [],
          errors: [{ msg: "Error occurred while retrieving messages" }],
        });
      }
    } else {
      res.render("index", {
        title: title,
        user: req.user,
        errors: [],
      });
    }
  },
  getRegisterPage: (req, res) => {
    res.render("register", {
      title: "Register Form",
      errors: [],
      formData: {},
    });
  },
  register: [
    ...validateRegisterForm,
    asyncHandler(async (req, res) => {
      console.log("Registering user");
      const { firstName, lastName, email, password } = req.body;
      // validate register form
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log("Validation errors: ", errors.array());
        return res.render("register", {
          title: "Register Form",
          errors: errors.array(),
          formData: { firstName, lastName, email },
        });
      }
      // if there are no errors, hash password then call queries to create user
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await userQueries.createUser({
          firstName,
          lastName,
          email,
          hashedPassword,
        });
        console.log("User registered");
        res.redirect("/login");
      } catch (dbError) {
        console.log("Error registering user: ", dbError);
        if (dbError.code === "23505" && dbError.detail.includes("email")) {
          res.render("register", {
            title: "Register Form",
            errors: [{ msg: "Email already exists" }],
            formData: { firstName, lastName, email },
          });
        }
      }
    }),
  ],
  getLoginPage: (req, res) => {
    const errors = req.session.messages
      ? [{ msg: req.session.messages.pop() }]
      : [];
    res.render("login", {
      title: "Login Form",
      errors: errors,
      formData: {},
    });
  },
  login: [
    ...validateLoginForm,
    (req, res, next) => {
      const errors = validationResult(req);
      const { email } = req.body;
      if (!errors.isEmpty()) {
        console.log("Validation errors: ", errors.array());
        return res.render("login", {
          title: "Login Form",
          errors: errors.array(),
          formData: { email },
        });
      }
      next();
    },
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: true,
      failureMessage: true,
    }),
  ],
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  },
};

module.exports = indexController;
