const fs = require("fs");
const path = require('path');

/**
 * Loads the path from 'tsconfig' and turns them into a list of webpack aliases
 */
module.exports  = () => {
	let stream = fs.readFileSync(path.resolve(__dirname, "../tsconfig.paths.json")).toString();
	stream = stream.replace(/\/\*.*\*\//g, ''); // remove comments /* .. */
	const config = JSON.parse(stream);
	const paths = config.compilerOptions?.paths ?? {};

	const aliases = {};
	for (const [name, tscPath] of Object.entries(paths)) {
		aliases[name] = path.resolve(__dirname, '..', Array.isArray(tscPath) ? tscPath[0] : String(tscPath));
	}
	
	return aliases;
}
