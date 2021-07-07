const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { DefinePlugin } = require('webpack');


const baseConfig = {
	devtool: 'source-map',
	module:{
		rules:[
			{
				test: /\.tsx?$/i,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(css|scss)$/i,
				use: [CssPlugin.loader, 'css-loader', 'sass-loader'],
			},
			{
				test: /(\.svg$)/i,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['preact', 'env']
						}
					},
					{
						loader: '@svgr/webpack',
						options: { babel: false }
					}, 
					'url-loader'
				]
			}
		]
	},
	resolve:{
		extensions: ['.ts', '.tsx', '.js', '.css', '.scss', '.svg'],
		alias: {
			'react': 'preact/compat',
			'@hhf/ui': path.resolve(__dirname, '../libs/ui/index.ts'),
			'@hhf/rx': path.resolve(__dirname, '../libs/rx/index.ts'),
			'@hhf/services': path.resolve(__dirname, '../libs/services/index.ts'),
			'@types/trainer-api': path.resolve(__dirname, '../types/trainer-api/index.d.ts'),
			'@hhf/theme': path.resolve(__dirname, '../libs/theme/index.ts')
		}
	},
	optimization: {
		minimize: false,
		splitChunks:{
			cacheGroups:{
				runtime:{
					test: /[\\/]node_modules[\\/]/i,					
					name(module) {
						return 'runtime';
					}
				}
			},
			chunks: 'all'
		}
	},
	plugins:[
		new HtmlPlugin({
			base: "/",
		}),
	],
};

module.exports = (name, entry, isDev) => {
	const distPath = path.resolve(__dirname, '../build', name);
	const entryPath = entry;

	const config = Object.assign({}, baseConfig, 
		{
			entry: entryPath,
			output: {
				clean: true,
				filename: `${name}-[name].js`,
				chunkFilename: '[name]-[id].js',
				path: distPath,
			}
		}
	);

	config.plugins.push(
		new CssPlugin({
			filename: `${name}-[name].css`
		}),
	)

	if (isDev) {
		config.mode = 'development';
		config.devServer = {
			contentBase: distPath,
			compress: true,
			port: 4000,
			historyApiFallback: true,
			hot: true,
		}

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