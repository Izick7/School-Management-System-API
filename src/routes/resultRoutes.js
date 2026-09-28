const express = require("express");

const {
    createResult,
    getResults,
    getMyResults,
    getResult,
    updateResult,
    deleteResult
} = require("../controllers/resultController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const loadStudent = require("../middleware/loadStudent");
const {
    createResultValidator,
    updateResultValidator
} = require("../validators/resultValidator");
const { idParamValidator } = require("../validators/commonValidator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    authorize("admin", "teacher"),
    createResultValidator,
    validate,
    createResult
);

router.get(
    "/",
    authorize("admin", "teacher"),
    getResults
);

router.get(
    "/me",
    authorize("student"),
    loadStudent,
    getMyResults
);

router.get(
    "/:id",
    authorize("admin", "teacher"),
    idParamValidator,
    validate,
    getResult
);

router.put(
    "/:id",
    authorize("admin", "teacher"),
    idParamValidator,
    updateResultValidator,
    validate,
    updateResult
);

router.delete(
    "/:id",
    authorize("admin"),
    idParamValidator,
    validate,
    deleteResult
);

module.exports = router;
