const results = require("../data/results");
const students = require("../data/students");
const subjects = require("../data/subjects");
const generateId = require("../utils/generateId");
const calculateGrade = require("../utils/calculateGrade");

const createResult = (req, res, next) => {
    try {
        const { studentId, subjectId, score, term, session } = req.body;

        const studentExists = students.some(
            student => student.id === studentId
        );

        if (!studentExists) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const subjectExists = subjects.some(
            subject => subject.id === subjectId
        );

        if (!subjectExists) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        const duplicateResult = results.find(
            result =>
                result.studentId === studentId &&
                result.subjectId === subjectId &&
                result.term === term &&
                result.session === session
        );

        if (duplicateResult) {
            return res.status(409).json({
                success: false,
                message: "Result already exists for this student, subject, term and session"
            });
        }

        const result = {
            id: generateId(),
            studentId,
            subjectId,
            score,
            grade: calculateGrade(score),
            term,
            session,
            createdAt: new Date().toISOString()
        };

        results.push(result);

        res.status(201).json({
            success: true,
            message: "Result created successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const getResults = (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "Results retrieved successfully",
            data: results
        });
    } catch (error) {
        next(error);
    }
};

const getMyResults = (req, res, next) => {
    try {
        const myResults = results.filter(
            result => result.studentId === req.student.id
        );

        res.json({
            success: true,
            message: "Results retrieved successfully",
            data: myResults
        });
    } catch (error) {
        next(error);
    }
};

const getResult = (req, res, next) => {
    try {
        const result = results.find(result => result.id === req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        res.json({
            success: true,
            message: "Result retrieved successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const updateResult = (req, res, next) => {
    try {
        const result = results.find(result => result.id === req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        const { score, term, session } = req.body;

        if (score !== undefined) {
            result.score = score;
            result.grade = calculateGrade(score);
        }

        if (term !== undefined) result.term = term;
        if (session !== undefined) result.session = session;

        res.json({
            success: true,
            message: "Result updated successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

const deleteResult = (req, res, next) => {
    try {
        const index = results.findIndex(
            result => result.id === req.params.id
        );

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        const deletedResult = results.splice(index, 1)[0];

        res.json({
            success: true,
            message: "Result deleted successfully",
            data: deletedResult
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createResult,
    getResults,
    getMyResults,
    getResult,
    updateResult,
    deleteResult
};
