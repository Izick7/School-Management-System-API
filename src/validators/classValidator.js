const { body } = require("express-validator");

const createClassValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("level")
        .trim()
        .notEmpty()
        .withMessage("Level is required")
        .isLength({ max: 50 })
        .withMessage("Level must not exceed 50 characters")
];

const updateClassValidator = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ max: 100 })
        .withMessage("Name must not exceed 100 characters"),

    body("level")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Level cannot be empty")
        .isLength({ max: 50 })
        .withMessage("Level must not exceed 50 characters")
];

module.exports = {
    createClassValidator,
    updateClassValidator
};
