const crypto = require("crypto");

const generateVoucherCode = () => {
  const randomPart = crypto
    .randomBytes(4)
    .toString("hex")
    .toUpperCase();

  return `VAZHO-${randomPart}`;
};

module.exports = {
  generateVoucherCode,
};