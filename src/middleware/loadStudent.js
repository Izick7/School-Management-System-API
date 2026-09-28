const students = require("../data/students");

const loadStudent = (req, res, next) => {
    try {
        const student = students.find(
            student => student.userId === req.user.id
        );

        if (!student) {
            return res.status(403).json({
                success: false,
                message: "No student profile is linked to this account"
            });
        }

        req.student = student;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = loadStudent;
