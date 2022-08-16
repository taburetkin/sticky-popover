const terser = require('rollup-plugin-terser').terser;

module.exports = 
[
	{
		input: './tooling/sticky-popover-full.js',
		output: {
			file: './lib/sticky-popover-full-iife.js',
			format: 'iife',
			name: 'StickyPopover'
		},
		plugins:[ 
			terser()
		]
	},
	{
		input: './tooling/sticky-popover-full.js',
		output: {
			file: './lib/sticky-popover-full-umd.js',
			format: 'umd',
			name: 'sticky-popover'
		},
		plugins:[ 
			terser()
		]
	},
	{
		input: './tooling/sticky-popover-full.js',
		output: {
			file: './lib/sticky-popover-full.js',
			format: 'esm'
		},
		plugins:[ 
			terser()
		]
	},
	{
		input: './tooling/sticky-popover.js',
		output: {
			file: './lib/sticky-popover.js',
			format: 'esm'
		},
		plugins:[ 
			terser()
		]
	},
	{
		input: './tooling/positioning-api.js',
		output: {
			file: './lib/positioning-api.js',
			format: 'esm'
		},
		plugins:[ 
			terser()
		]
	},

]