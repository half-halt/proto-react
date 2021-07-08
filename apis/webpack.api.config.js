const path = require('path');
const Dotenv = require('dotenv-webpack');
const { DefinePlugin } = require('webpack');

const baseConfig = {
	target: 'node',
	devtool: 'source-map',
	module:{
		rules:[
			{
				test: /\.ts$/i,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	},
	resolve:{
		extensions: ['.ts','.js'],
		alias: {
			'@hhf/trainer-api-types': path.resolve(__dirname, '../types/trainer-api-types/index.ts'),
		}
	},
	optimization: {
		minimize: false,
	},
	performance:{
		maxEntrypointSize: 5000000000,
		maxAssetSize: 100000000,		
	},
	plugins:[],
};

module.exports = (name, entry, isDev) => {
	const distPath = path.resolve(__dirname, '../build/api', name);
	const entryPath = entry;

	const config = Object.assign({}, baseConfig, 
		{
			entry: entryPath,
			output: {
				clean: true,
				filename: `${name}.js`,
				path: distPath,
				chunkFormat: 'commonjs',
				libraryTarget: 'umd'
			}
		}
	);

	if (isDev) {
		config.mode = 'development';
		config.plugins.push(
			new Dotenv({
				path: path.resolve(__dirname, '../.env.development'),
				safe: true,
			}),
		);
		config.plugins.push(
			new DefinePlugin({
				PRODUCTION: false,
			})
		);
	} else {
		config.mode = 'production';
		config.optimization.minimize = true;

		config.plugins.push(
			new Dotenv({
				path: path.resolve(__dirname, '../.env'),
				safe: true,
			})			
		);
		config.plugins.push(
			new DefinePlugin({
				PRODUCTION: true,
			})
		);
	}

	return config;
}