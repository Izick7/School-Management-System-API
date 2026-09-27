const bcrypt = require("bcrypt");

const users = require("./users");
const generateId = require("../utils/generateId");

const seedAdmin = async () => {
    const adminExists = users.some(user => user.role === "admin");

    if (adminExists) {
        return;
    }

    const passwordHash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
    );

    users.push({
        id: generateId(),
        name: "System Admin",
        email: process.env.ADMIN_EMAIL,
        passwordHash,
        role: "admin",
        createdAt: new Date().toISOString()
    });

    console.log("Admin user seeded");
};

module.exports = seedAdmin;