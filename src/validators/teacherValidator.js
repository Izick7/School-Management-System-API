const { body } = require("express-validator");

const createTeacherValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone is required")
        .isLength({ min: 7, max: 15 })
        .withMessage("Phone must be between 7 and 15 characters"),

    body("subjectId")
        .trim()
        .notEmpty()
        .withMessage("Subject is required")
        .isString()
        .withMessage("Subject must be a valid id"),

    body("userId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("User id must be a valid string")
        .isString()
        .withMessage("User id must be a valid string"),

    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
];

const updateTeacherValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),

    body("phone")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Phone cannot be empty")
        .isLength({ min: 7, max: 15 })
        .withMessage("Phone must be between 7 and 15 characters"),

    body("subjectId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Subject cannot be empty")
        .isString()
        .withMessage("Subject must be a valid id")
];

module.exports = {
    createTeacherValidator,
    updateTeacherValidator
};
