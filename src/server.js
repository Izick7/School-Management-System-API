require("dotenv").config();

const app = require("./app");
const seedAdmin = require("./data/seed");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await seedAdmin();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();