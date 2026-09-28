const logger = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const timestamp = new Date().toISOString();

        console.log(
            `${timestamp} ${req.method} ${req.originalUrl} ${res.statusCode} ${
                Date.now() - startTime
            }ms`
        );
    });

    next();
};

module.exports = logger;
