const handleError = (error, res) => {
  console.error("Error:", error);
  
  const status = error.status || 500;
  const message = error.message || "Internal server error";
  
  res.status(status);
  res.json({
    status: "error",
    message: message,
  });
};

module.exports = handleError;