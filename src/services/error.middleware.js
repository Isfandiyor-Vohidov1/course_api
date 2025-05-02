export const catchError = (error, res) => {
    console.error("Caught error:", error);
    res.status(500).json({
        statusCode: 500,
        message: error.message || 'Internal Server Error'
    });
};
