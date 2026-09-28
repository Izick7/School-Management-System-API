const express = require("express");

const {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubject
} = require("../controllers/subjectController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
    createSubjectValidator,
    updateSubjectValidator
} = require("../validators/subjectValidator");
const { idParamValidator } = require("../validators/commonValidator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    authorize("admin"),
    createSubjectValidator,
    validate,
    createSubject
);

router.get(
    "/",
    authorize("admin", "teacher", "student"),
    getSubjects
);

router.get(
    "/:id",
    authorize("admin", "teacher", "student"),
    idParamValidator,
    validate,
    getSubject
);

router.put(
    "/:id",
    authorize("admin"),
    idParamValidator,
    updateSubjectValidator,
    validate,
    updateSubject
);

router.delete(
    "/:id",
    authorize("admin"),
    idParamValidator,
    validate,
    deleteSubject
);

module.exports = router;
