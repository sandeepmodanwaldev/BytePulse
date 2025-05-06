import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("username")
      .isString()
      .isLength({ min: 5, max: 20 })
      .withMessage("Username must be between 5 and 20 characters")
      // .matches(/^[a-zA-Z0-9_]*$/)
      // .withMessage(
      //   "Username can only contain alphanumeric characters and underscores"
      // )
      .trim()
      .notEmpty()
      .withMessage("Username cannot be empty"),

    body("password")
      .isString()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters")
      // .matches(
      //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,25}$/
      // )
      // .withMessage(
      //   "Password must contain at least one letter, one number, and one special character"
      // )
      .notEmpty()
      .withMessage("Password cannot be empty"),

    body("confirmPassword")
      .isString()
      .notEmpty()
      .withMessage("Confirm password cannot be empty")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),

    body("email")
      .isEmail()
      .withMessage("Invalid email")
      .normalizeEmail()
      .notEmpty()
      .withMessage("Email cannot be empty"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("invalide emial")
      .normalizeEmail()
      .notEmpty()
      .withMessage("Emailcannot be empty"),
    body("password")
      .isString()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters")
      // .matches(
      //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,25}$/
      // )
      // .withMessage(
      //   "Password must contain at least one letter, one number, and one special character"
      // )
      .notEmpty()
      .withMessage("Password cannot be empty"),
  ];
};

const forgotPasswordRequestValidator = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("invalide emial")
      .normalizeEmail()
      .notEmpty()
      .withMessage("Emailcannot be empty"),
  ];
};

const forgotPasswordValidator = () => {
  return [
    body("newPassword")
      .isString()
      .isLength({ min: 8, max: 25 })
      .withMessage("Password must be between 8 and 25 characters")
      // .matches(
      //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,25}$/
      // )
      // .withMessage(
      //   "Password must contain at least one letter, one number, and one special character"
      // )
      .notEmpty()
      .withMessage("Password cannot be empty"),

    body("confirmPassword")
      .isString()
      .notEmpty()
      .withMessage("Confirm password cannot be empty")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ];
};

export {
  userRegistrationValidator,
  userLoginValidator,
  forgotPasswordRequestValidator,
  forgotPasswordValidator,
};
