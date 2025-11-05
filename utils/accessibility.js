// Minimal bridge: reuse the canonical shared implementation to avoid duplication.
// Keeping CommonJS require to support `require("../../utils/accessibility")` in tests.
const shared = require("../src/shared/utils/accessibility");

module.exports = shared;
