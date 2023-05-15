const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const envConfig = result.parsed;

module.exports = {
  envConfig,
};
