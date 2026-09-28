const { body } = require("express-validator");

const createResultValidator = [
    body("studentId")
        .trim()
        .notEmpty()
        .withMessage("Student is required")
        .isString()
        .withMessage("Student must be a valid id"),

    body("subjectId")
        .trim()
        .notEmpty()
        .withMessage("Subject is required")
        .isString()
        .withMessage("Subject must be a valid id"),

    body("score")
        .trim()
        .notEmpty()
        .withMessage("Score is required")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Score must be a number between 0 and 100")
        .toFloat(),

    body("term")
        .trim()
        .notEmpty()
        .withMessage("Term is required")
        .isLength({ max: 50 })
        .withMessage("Term must not exceed 50 characters"),

    body("session")
        .trim()
        .notEmpty()
        .withMessage("Session is required")
        .isLength({ max: 50 })
        .withMessage("Session must not exceed 50 characters")
];

const updateResultValidator = [
    body("score")
        .trim()
        .notEmpty()
        .withMessage("Score cannot be empty")
        .isFloat({ min: 0, max: 100 })
        .withMessage("Score must be a number between 0 and 100")
        .toFloat(),

    body("term")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Term cannot be empty")
        .isLength({ max: 50 })
        .withMessage("Term must not exceed 50 characters"),

    body("session")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Session cannot be empty")
        .isLength({ max: 50 })
        .withMessage("Session must not exceed 50 characters")

        
];

module.exports = {
    createResultValidator,
    updateResultValidator
};
