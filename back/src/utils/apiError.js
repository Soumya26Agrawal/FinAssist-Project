class ApiError extends Error {
    constructor(message, statusCode) {
      super(message); // Call the parent class's constructor
      this.statusCode = statusCode || 500; // Default to 500 if not provided
      Error.captureStackTrace(this, this.constructor); // Correctly capture the stack trace
    }
  }

  export default ApiError