const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err.status) {
        return res.status(err.status).json({
            success: false,
            message: err.message || "Request failed"
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
};

module.exports = errorHandler;
