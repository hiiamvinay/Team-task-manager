const getStartupStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend server is running",
    startedAt: req.app.locals.startedAt,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  getStartupStatus,
};
