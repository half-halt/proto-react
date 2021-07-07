const createConfig = require("../webpack.api.config");
const path = require("path");

module.exports = (env, argv) => createConfig('trainer-api', path.resolve(__dirname, 'src/main.ts'), argv.mode === 'development');