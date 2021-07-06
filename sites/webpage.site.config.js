const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const CssPlugin = require('mini-css-extract-plugin');


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
			}
		]
	},
	resolve:{
		extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
		alias: {
			'@hhf/ui': path.resolve(__dirname, '../libs/ui/index.ts'),
			'@hhf/rx': path.resolve(__dirname, '../libs/rx/index.ts'),
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
		new HtmlPlugin(),
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
	} else {
		config.mode = 'production';
		config.optimization.minimize = true;
	}

	return config;
}