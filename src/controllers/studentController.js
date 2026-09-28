const students = require("../data/students");
const users = require("../data/users");
const classes = require("../data/classes");
const generateId = require("../utils/generateId");

const createStudent = (req, res, next) => {
    try {
        const { name, email, phone, classId, userId } = req.body;

        const classExists = classes.some(cls => cls.id === classId);

        if (!classExists) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const user = users.find(user => user.id === userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (students.some(student => student.userId === userId)) {
            return res.status(409).json({
                success: false,
                message: "Student profile already exists for this user"
            });
        }

        const student = {
            id: generateId(),
            name,
            email,
            phone,
            classId,
            userId,
            createdAt: new Date().toISOString()
        };

        students.push(student);

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });
    } catch (error) {
        next(error);
    }
};

const getStudents = (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Students retrieved successfully",
            data: students
        });
    } catch (error) {
        next(error);
    }
};

const getStudent = (req, res, next) => {
    try {
        const student = students.find(
            student => student.id === req.params.id
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.json({
            success: true,
            message: "Student retrieved successfully",
            data: student
        });
    } catch (error) {
        next(error);
    }
};

const updateStudent = (req, res, next) => {
    try {
        const student = students.find(
            student => student.id === req.params.id
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const { name, email, phone, classId } = req.body;

        if (classId) {
            const classExists = classes.some(cls => cls.id === classId);

            if (!classExists) {
                return res.status(404).json({
                    success: false,
                    message: "Class not found"
                });
            }

            student.classId = classId;
        }

        if (name !== undefined) student.name = name;
        if (email !== undefined) student.email = email;
        if (phone !== undefined) student.phone = phone;

        res.json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        next(error);
    }
};

const deleteStudent = (req, res, next) => {
    try {
        const index = students.findIndex(
            student => student.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const deletedStudent = students.splice(index, 1)[0];

        res.json({
            success: true,
            message: "Student deleted successfully",
            data: deletedStudent
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createStudent,
    getStudents,
    getStudent,
    updateStudent,
    deleteStudent
};