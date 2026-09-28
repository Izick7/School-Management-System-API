const bcrypt = require("bcrypt");
const teachers = require("../data/teachers");
const users = require("../data/users");
const subjects = require("../data/subjects");
const generateId = require("../utils/generateId");

const findTeacherByUserId = userId =>
    teachers.find(teacher => teacher.userId === userId);

const createTeacher = async (req, res, next) => {
    try {
        const { name, email, phone, subjectId, userId, password } = req.body;

        const subjectExists = subjects.some(subject => subject.id === subjectId);

        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        if (userId) {
            const user = users.find(user => user.id === userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });
            }

            if (user.role !== "teacher") {
                return res.status(400).json({
                    success: false,
                    message: "User must have teacher role"
                });
            }

            if (findTeacherByUserId(userId)) {
                return res.status(409).json({
                    success: false,
                    message: "Teacher profile already exists for this user"
                });
            }
        } else {
            if (!password) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Password is required when creating a teacher account"
                });
            }

            const emailTaken = users.find(user => user.email === email);

            if (emailTaken) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });
            }
        }

        let linkedUserId = userId;

        if (!userId) {
            const passwordHash = await bcrypt.hash(password, 10);

            const user = {
                id: generateId(),
                name,
                email,
                passwordHash,
                role: "teacher",
                createdAt: new Date().toISOString()
            };

            users.push(user);

            linkedUserId = user.id;
        }

        const teacher = {
            id: generateId(),
            name,
            email,
            phone,
            subjectId,
            userId: linkedUserId,
            createdAt: new Date().toISOString()
        };

        teachers.push(teacher);

        res.status(201).json({
            success: true,
            message: "Teacher created successfully",
            data: teacher
        });
    } catch (error) {
        next(error);
    }
};

const getTeachers = (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Teachers retrieved successfully",
            data: teachers
        });
    } catch (error) {
        next(error);
    }
};

const getTeacher = (req, res, next) => {
    try {
        const teacher = teachers.find(
            teacher => teacher.id === req.params.id
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({
            success: true,
            message: "Teacher retrieved successfully",
            data: teacher
        });
    } catch (error) {
        next(error);
    }
};

const updateTeacher = (req, res, next) => {
    try {
        const teacher = teachers.find(
            teacher => teacher.id === req.params.id
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        const { name, email, phone, subjectId } = req.body;

        if (subjectId !== undefined) {
            const subjectExists = subjects.some(
                subject => subject.id === subjectId
            );

            if (!subjectExists) {
                return res.status(404).json({
                    success: false,
                    message: "Subject not found"
                });
            }

            teacher.subjectId = subjectId;
        }

        if (name !== undefined) teacher.name = name;
        if (email !== undefined) teacher.email = email;
        if (phone !== undefined) teacher.phone = phone;

        res.json({
            success: true,
            message: "Teacher updated successfully",
            data: teacher
        });
    } catch (error) {
        next(error);
    }
};

const deleteTeacher = (req, res, next) => {
    try {
        const index = teachers.findIndex(
            teacher => teacher.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        const deletedTeacher = teachers.splice(index, 1)[0];

        res.json({
            success: true,
            message: "Teacher deleted successfully",
            data: deletedTeacher
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTeacher,
    getTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher,
    findTeacherByUserId
};
