var Webpack = require('webpack');
var HtmlPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var path = require('path');

var DIST_FOLDER = path.join(__dirname, 'demo', 'dist');
var SRC_FOLDER = path.join(__dirname, 'demo', 'src');

module.exports = {
	entry: {
		'app': path.join(SRC_FOLDER, 'app.ts'),
		'app.css': path.join(SRC_FOLDER, 'app.css.ts')
	},

	output: {
		path: DIST_FOLDER,
		filename: '[name].js'
	},

	resolve: {
		extensions: ['', '.ts', '.html', '.js']
	},

	module: {
		loaders: [
			// COMPONENTS
			{
				test: /\.ts$/i,
				loader: 'ts-loader!angular2-template-loader'
			},
			{
				test: /\.html$/i,
				loader: 'html-loader'
			},
			{
				test: /\.component\.css$/i,
				loader: 'raw-loader'
			},

			// DEMO
			{
				test: /\?raw$/i,
				loader: 'raw-loader'
			},

			// EXTRA
			{
				test: /\.css$/i,
				loader: ExtractTextPlugin.extract('css-loader'),
				exclude: /\.component\.css$/i
			}
		]
	},

	devtool: 'source-map',

	devServer: {
		historyApiFallback: true,
		contentBase: DIST_FOLDER,
		inline: true
	},

	plugins: [
		new HtmlPlugin({
			filename: 'index.html',
			template: path.join(SRC_FOLDER, 'index.html'),

			chunks: ['app']
		}),

		new ExtractTextPlugin('app.css')
	]
}