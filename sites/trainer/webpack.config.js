const createConfig = require("../webpack.site.config");
const path = require("path");

module.exports = (env, argv) => createConfig('trainer', path.resolve(__dirname, 'src/index.tsx'), argv.mode === 'development');