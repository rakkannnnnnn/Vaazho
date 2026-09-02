const { requireRole } = require("./roleMiddleware");

const requireOwner = requireRole("owner");

module.exports = requireOwner;
