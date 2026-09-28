const express = require("express");

const {
    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass
} = require("../controllers/classController");

const authenticate = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.use(authenticate);

router.post(
    "/",
    authorize("admin"),
    createClass
);

router.get(
    "/",
    authorize("admin", "teacher", "student"),
    getClasses
);

router.get(
    "/:id",
    authorize("admin", "teacher", "student"),
    getClass
);

router.put(
    "/:id",
    authorize("admin"),
    updateClass
);

router.delete(
    "/:id",
    authorize("admin"),
    deleteClass
);

module.exports = router;