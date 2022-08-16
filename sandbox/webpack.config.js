const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
	mode: 'development',
	plugins: [
		new HtmlWebpackPlugin({

		})
	],
	module:{
		rules: [
			{
				test: /\.less$/i,
				use: [
					'style-loader',
					'css-loader',
					'less-loader'
				]
			},
		]
	}
}