const { body } = require("express-validator");

const createStudentValidator = [
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

    body("classId")
        .trim()
        .notEmpty()
        .withMessage("Class is required")
        .isString()
        .withMessage("Class must be a valid id"),

    body("userId")
        .trim()
        .notEmpty()
        .withMessage("User is required")
        .isString()
        .withMessage("User must be a valid id")
];

const updateStudentValidator = [
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

    body("classId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Class cannot be empty")
        .isString()
        .withMessage("Class must be a valid id")
];

module.exports = {
    createStudentValidator,
    updateStudentValidator
};
