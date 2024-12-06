// middlewares/errorHandler.js
const CreateError = require('../utils/createError'); // Import CreateError utility

const errorHandler = (err, req, res, next) => {
    // Log the error details
    console.error( `Error: ${err.message}`);
    
    // If the error doesn't have a status, set it to 500 (Internal Server Error)
    const statusCode = err.status || 500;
    
    // Send the error response as JSON
    res.status(statusCode).json({
        error: {
            message: err.message || 'Internal Server Error', // Default message if none provided
        },
    });
};

module.exports = errorHandler;