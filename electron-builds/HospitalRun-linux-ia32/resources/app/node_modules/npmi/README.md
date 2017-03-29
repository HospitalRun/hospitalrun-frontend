npmi [![Build Status](https://travis-ci.org/maxleiko/npmi.svg)](https://travis-ci.org/maxleiko/npmi)
====

NodeJS package that gives a simplier API to npm install (programatically installs things)

### Installation
```sh
npm install npmi --save
```

### Options
#### options.name
__Type:__ `String`
__Optional:__ `true`

If you don't specify a `name` in options, but just a `path`, __npmi__ will do the same as if you were at this path in a terminal and executing `npm install`  
Otherwise, it will install the module specified by this name like `npm install module-name` does.

#### options.version
__Type:__ `String`
__Optional:__ `true`
__Default__ `'latest'`

Desired version for installation

#### options.path
__Type:__ `String`
__Optional:__ `true`
__Default__ `'.'`

Desired location for installation (note that if you specified /some/foo/path, __npm__ will automatically create a `node_modules` sub-folder at this location, resulting in `/some/foo/path/node_modules`). So don't specify the `node_modules` part in your path

#### options.forceInstall
__Type:__ `Boolean`
__Optional:__ `true`
__Default__ `false`

If true, __npmi__ will install `options.name` module even though it has already been installed.  
If false, __npmi__ will check if the module is already installed, if it is, it will also check if the installed version is equal to `options.version`, otherwise, it will install `options.name@options.version`

#### options.localInstall
__Type:__ `Boolean`
__Optional:__ `true`
__Default__ `false`

Allows __npmi__ to install local module that are not on __npm registry__. If, you want to install a local module by specifying its full path in `options.name`, you need to set this to `true`.

#### options.npmLoad
__Type:__ `Object`
__Optional:__ `true`
__Default__ `{loglevel: 'silent'}`

This object is given to __npm__ and allows you to do some fine-grained npm configurations.  
It is processed by __npm__ like command-line arguments but within an Object map ([npm-config](https://www.npmjs.org/doc/misc/npm-config.html))

### Usage example
```js
var npmi = require('npmi');
var path = require('path');

console.log(npmi.NPM_VERSION); // prints the installed npm version used by npmi


var options = {
	name: 'your-module',	// your module name
	version: '0.0.1',		// expected version [default: 'latest']
	path: '.',				// installation path [default: '.']
	forceInstall: false,	// force install if set to true (even if already installed, it will do a reinstall) [default: false]
	npmLoad: {				// npm.load(options, callback): this is the "options" given to npm.load()
		loglevel: 'silent'	// [default: {loglevel: 'silent'}]
	}
};
npmi(options, function (err, result) {
	if (err) {
		if 		(err.code === npmi.LOAD_ERR) 	console.log('npm load error');
		else if (err.code === npmi.INSTALL_ERR) console.log('npm install error');
		return console.log(err.message);
	}

	// installed
	console.log(options.name+'@'+options.version+' installed successfully in '+path.resolve(options.path));
});
```
