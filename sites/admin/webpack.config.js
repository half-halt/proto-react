const createConfig = require("../../webpack/webpack.site.config");
const path = require("path");

module.exports = (env, argv) => createConfig('admin', path.resolve(__dirname, 'index.tsx'), argv.mode === 'development');