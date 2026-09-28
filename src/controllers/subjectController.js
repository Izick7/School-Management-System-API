const subjects = require("../data/subjects");
const generateId = require("../utils/generateId");

const createSubject = (req, res, next) => {
    try {
        const { name, code } = req.body;

        const existingSubject = subjects.find(subject => subject.code === code);

        if (existingSubject) {
            return res.status(409).json({
                success: false,
                message: "Subject code already exists"
            });
        }

        const newSubject = {
            id: generateId(),
            name,
            code,
            createdAt: new Date().toISOString()
        };

        subjects.push(newSubject);

        res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: newSubject
        });
    } catch (error) {
        next(error);
    }
};

const getSubjects = (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Subjects retrieved successfully",
            data: subjects
        });
    } catch (error) {
        next(error);
    }
};

const getSubject = (req, res, next) => {
    try {
        const subject = subjects.find(
            subject => subject.id === req.params.id
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        res.json({
            success: true,
            message: "Subject retrieved successfully",
            data: subject
        });
    } catch (error) {
        next(error);
    }
};

const updateSubject = (req, res, next) => {
    try {
        const subject = subjects.find(
            subject => subject.id === req.params.id
        );

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        const { name, code } = req.body;

        if (code !== undefined && code !== subject.code) {
            const codeTaken = subjects.find(subject => subject.code === code);

            if (codeTaken) {
                return res.status(409).json({
                    success: false,
                    message: "Subject code already exists"
                });
            }

            subject.code = code;
        }

        if (name !== undefined) subject.name = name;

        res.json({
            success: true,
            message: "Subject updated successfully",
            data: subject
        });
    } catch (error) {
        next(error);
    }
};

const deleteSubject = (req, res, next) => {
    try {
        const index = subjects.findIndex(
            subject => subject.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        const deletedSubject = subjects.splice(index, 1)[0];

        res.json({
            success: true,
            message: "Subject deleted successfully",
            data: deletedSubject
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSubject,
    getSubjects,
    getSubject,
    updateSubject,
    deleteSubject
};
