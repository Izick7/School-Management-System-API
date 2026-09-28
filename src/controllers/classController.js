const classes = require("../data/classes");
const generateId = require("../utils/generateId");

const createClass = (req, res, next) => {
    try {
        const { name, level } = req.body;

        const existingClass = classes.find(
            cls => cls.name === name && cls.level === level
        );

        if (existingClass) {
            return res.status(409).json({
                success: false,
                message: "Class already exists"
            });
        }

        const newClass = {
            id: generateId(),
            name,
            level,
            createdAt: new Date().toISOString()
        };

        classes.push(newClass);

        res.status(201).json({
            success: true,
            message: "Class created successfully",
            data: newClass
        });
    } catch (error) {
        next(error);
    }
};

const getClasses = (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Classes retrieved successfully",
            data: classes
        });
    } catch (error) {
        next(error);
    }
};

const getClass = (req, res, next) => {
    try {
        const classItem = classes.find(
            cls => cls.id === req.params.id
        );

        if (!classItem) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        res.json({
            success: true,
            message: "Class retrieved successfully",
            data: classItem
        });
    } catch (error) {
        next(error);
    }
};

const updateClass = (req, res, next) => {
    try {
        const classItem = classes.find(
            cls => cls.id === req.params.id
        );

        if (!classItem) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const { name, level } = req.body;

        if (name !== undefined) classItem.name = name;
        if (level !== undefined) classItem.level = level;

        res.json({
            success: true,
            message: "Class updated successfully",
            data: classItem
        });
    } catch (error) {
        next(error);
    }
};

const deleteClass = (req, res, next) => {
    try {
        const index = classes.findIndex(
            cls => cls.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        const deletedClass = classes.splice(index, 1)[0];

        res.json({
            success: true,
            message: "Class deleted successfully",
            data: deletedClass
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createClass,
    getClasses,
    getClass,
    updateClass,
    deleteClass
};