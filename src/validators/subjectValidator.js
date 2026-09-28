const { body } = require("express-validator");

const createSubjectValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("code")
        .trim()
        .notEmpty()
        .withMessage("Code is required")
        .isLength({ min: 2, max: 20 })
        .withMessage("Code must be between 2 and 20 characters")
        .matches(/^[A-Za-z0-9-]+$/)
        .withMessage("Code may only contain letters, numbers and hyphens")
        .toUpperCase()
];

const updateSubjectValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("code")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Code cannot be empty")
        .isLength({ min: 2, max: 20 })
        .withMessage("Code must be between 2 and 20 characters")
        .matches(/^[A-Za-z0-9-]+$/)
        .withMessage("Code may only contain letters, numbers and hyphens")
        .toUpperCase()
];

module.exports = {
    createSubjectValidator,
    updateSubjectValidator
};
