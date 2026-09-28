const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../data/users");
const generateId = require("../utils/generateId");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = {
            id: generateId(),
            name,
            email,
            passwordHash,
            role: "student",
            createdAt: new Date().toISOString()
        };

        users.push(user);

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login
};