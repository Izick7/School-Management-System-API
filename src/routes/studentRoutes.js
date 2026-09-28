const express = require("express");

const {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    authorize("admin"),
    createStudent
);

router.get(
    "/",
    authorize("admin", "teacher"),
    getStudents
);

router.get(
    "/:id",
    authorize("admin", "teacher"),
    getStudent
);

router.put(
    "/:id",
    authorize("admin"),
    updateStudent
);

router.delete(
    "/:id",
    authorize("admin"),
    deleteStudent
);

module.exports = router;