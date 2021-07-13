const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const { DefinePlugin } = require('webpack');
const fs = require("fs");
const loadAliases = require('../webpack/loadAliases');

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
						loader: '@svgr/webpack',
					}, 
				]
			}
		]
	},
	resolve:{
		extensions: ['.ts', '.tsx', '.js', '.css', '.scss', '.svg'],
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

	config.resolve.alias = Object.assign({}, loadAliases(), config.resolve.alias || {});
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