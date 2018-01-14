const del = require('del');
const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');
const shell = require('shelljs');
const SystemJsBuilder = require('systemjs-builder');

shell.exec('npm run build');

fs.writeFileSync('dist/package.json', JSON.stringify(omit(pkg, 'private'), null, 2), { encoding: 'utf-8' });

const targetFolder = path.resolve('./dist/bundles');
del(targetFolder)
	.then(() => {
		return Promise.all([
			buildSystemJs(),
			buildSystemJs({ minify: true })
		]);
	})
	.catch(e => console.log(e));

function buildSystemJs(options = {}) {
	const minPostFix = options && options.minify ? '.umd.min' : '.umd';
	const fileName = `${pkg.name}${minPostFix}.js`;
	const dest = path.resolve(__dirname, targetFolder, fileName);
	const systemJsBuilder = new SystemJsBuilder();

	console.log('Bundling system.js file:', fileName, options);
	systemJsBuilder.config(getSystemJsBundleConfig());

	return systemJsBuilder
		.buildStatic('dist/index', dest, Object.assign({
			format: 'umd',
			minify: false,
			sourceMaps: true,
			mangle: false,
			noEmitHelpers: false,
			declaration: false
		}, options))
		.then((b) => {
			console.log(`Build complete: ${minPostFix}`);
		})
		.catch(err => {
			console.log('Error', err);
		});
}

function getSystemJsBundleConfig() {
	return {
		baseURL: '.',
		map: {
			typescript: './node_modules/typescript/lib/typescript.js',
			'@angular': './node_modules/@angular',
			rxjs: './node_modules/rxjs/bundles',
			uuid: './node_modules/uuid',
			crypto: '@empty'
		},
		paths: {
			'*': '*.js'
		},
		meta: {
			'./node_modules/@angular/*': { build: false },
			'./node_modules/rxjs/*': { build: false }
		}
	};
}

function omit(obj, key) {
	return Object
		.keys(obj)
		.reduce((result, prop) => {
			if (prop === key) return result;
			return Object.assign(result, { [prop]: obj[prop] })
		}, {});
}
