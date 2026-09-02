const { requireRole } = require("./roleMiddleware");

const requireAdmin = requireRole("admin");

module.exports = requireAdmin;
