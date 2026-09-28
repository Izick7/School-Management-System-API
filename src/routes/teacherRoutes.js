const express = require("express");

const {
    createTeacher,
    getTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacherController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const {
    createTeacherValidator,
    updateTeacherValidator
} = require("../validators/teacherValidator");
const { idParamValidator } = require("../validators/commonValidator");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    authorize("admin"),
    createTeacherValidator,
    validate,
    createTeacher
);

router.get(
    "/",
    authorize("admin", "teacher"),
    getTeachers
);

router.get(
    "/:id",
    authorize("admin", "teacher"),
    idParamValidator,
    validate,
    getTeacher
);

router.put(
    "/:id",
    authorize("admin"),
    idParamValidator,
    updateTeacherValidator,
    validate,
    updateTeacher
);

router.delete(
    "/:id",
    authorize("admin"),
    idParamValidator,
    validate,
    deleteTeacher
);

module.exports = router;