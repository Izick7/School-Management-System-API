const { param } = require("express-validator");

const idParamValidator = [
    param("id")
        .trim()
        .notEmpty()
        .withMessage("Id is required")
        .isString()
        .withMessage("Id must be a valid string")
];

module.exports = {
    idParamValidator
};
