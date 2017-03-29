var npm    = require('npm');
var fs     = require('fs');
var path   = require('path');
var semver = require('semver');

var LOAD_ERR    = 'NPM_LOAD_ERR',
    INSTALL_ERR = 'NPM_INSTALL_ERR',
    VIEW_ERR    = 'NPM_VIEW_ERR';

/**
 * Created with IntelliJ IDEA.
 * User: leiko
 * Date: 30/01/14
 * Time: 10:28
 */
var npmi = function (options, callback) {
    callback = callback || function () {};

    var name         = options.name,
        pkgName      = options.pkgName || name,
        version      = options.version || 'latest',
        installPath  = options.path || '.',
        forceInstall = options.forceInstall || false,
        localInstall = options.localInstall || false,
        npmLoad      = options.npmLoad || {loglevel: 'silent'},
        savedPrefix  = null;

    function viewCallback(installedVersion)  {
        return function (err, view) {
            if (err) {
                // reset npm.prefix to saved value
                npm.prefix = savedPrefix;
                err.code = VIEW_ERR;
                return callback(err);
            }

            // npm view success
            var latestVersion = Object.keys(view)[0];
            if ((typeof latestVersion !== 'undefined') && (latestVersion === installedVersion)) {
                // reset npm.prefix to saved value
                npm.prefix = savedPrefix;
                return callback();
            } else {
                npm.commands.install(installPath, [name+'@'+latestVersion], installCallback);
            }
        }
    }

    function checkInstalled(isTarball) {
        var module = name+'@'+version;

        if (isTarball) {
            module = name;
            if (pkgName === name) {
                console.warn('npmi warn: install "'+name+'" from tarball/folder without options.pkgName specified => forceInstall: true');
            }
        }

        // check that version matches
        fs.readFile(path.resolve(installPath, 'node_modules', pkgName, 'package.json'), function (err, pkgRawData) {
            if (err) {
                // hmm, something went wrong while reading module's package.json file
                // lets try to reinstall it just in case
                return npm.commands.install(installPath, [module], installCallback);
            }

            var pkg = JSON.parse(pkgRawData);
            if (version === 'latest') {
                // specified version is "latest" which means nothing for a comparison check
                if (isTarball) {
                    // when a package is already installed and it comes from a tarball, you have to specify
                    // a real version => warn
                    console.warn('npmi warn: install from tarball without options.version specified => forceInstall: true');
                    return npm.commands.install(installPath, [module], installCallback);
                } else {
                    // so we need to ask npm to give us a view of the module from remote registry
                    // in order to check if it really is the latest one that is currently installed
                    return npm.commands.view([name], true, viewCallback(pkg.version));
                }

            } else if (pkg.version === version) {
                // package is installed and version matches
                // reset npm.prefix to saved value
                npm.prefix = savedPrefix;
                return callback();

            } else {
                // version does not match: reinstall
                return npm.commands.install(installPath, [module], installCallback);
            }
        });
    }

    function installCallback(err, result) {
        // reset npm.prefix to saved value
        npm.prefix = savedPrefix;

        if (err) {
            err.code = INSTALL_ERR;
        }

        callback(err, result);
    }

    function loadCallback(err) {
        if (err) {
            err.code = LOAD_ERR;
            return callback(err);
        }

        // npm loaded successfully
        savedPrefix = npm.prefix; // save current npm.prefix
        npm.prefix = installPath; // change npm.prefix to given installPath
        if (!name) {
            // just want to do an "npm install" where a package.json is
            npm.commands.install(installPath, [], installCallback);

        } else if (localInstall) {
            if (forceInstall) {
                // local install won't work with version specified
                npm.commands.install(installPath, [name], installCallback);
            } else {
                // check if there is already a local install of this module
                fs.readFile(path.resolve(name, 'package.json'), 'utf8', function (err, sourcePkgData) {
                    if (err) {
                        // reset npm.prefix to saved value
                        npm.prefix = savedPrefix;
                        callback(err);

                    } else {
                        try {
                            var sourcePkg = JSON.parse(sourcePkgData)
                        } catch (err) {
                            // reset npm.prefix to saved value
                            npm.prefix = savedPrefix;
                            callback(err);
                            return;
                        }

                        var pkgName = sourcePkg.name || path.basename(name);
                        fs.readFile(path.resolve(installPath, 'node_modules', pkgName, 'package.json'), 'utf8', function (err, targetPkgData) {
                            if (err) {
                                // file probably doesn't exist, or is corrupted: install
                                // local install won't work with version specified
                                npm.commands.install(installPath, [name], installCallback);
                            } else {
                                // there is a module that looks a lot like the one you want to install: do some checks
                                try {
                                    var targetPkg = JSON.parse(targetPkgData);
                                } catch (err) {
                                    // reset npm.prefix to saved value
                                    npm.prefix = savedPrefix;
                                    callback(err);
                                    return;
                                }

                                if (semver.gt(sourcePkg.version, targetPkg.version)) {
                                    // install because current found version seems outdated
                                    // local install won't work with version specified
                                    npm.commands.install(installPath, [name], installCallback);
                                } else {
                                    // reset npm.prefix to saved value
                                    npm.prefix = savedPrefix;
                                    callback();
                                }
                            }
                        });
                    }
                });
            }
        } else {
            if (forceInstall) {
                // reinstall package module
                if (name.indexOf('/') === -1) {
                    // not a tarball
                    npm.commands.install(installPath, [name+'@'+version], installCallback);
                } else {
                    // do not specify version for tarball
                    npm.commands.install(installPath, [name], installCallback);
                }

            } else {
                // check if package is installed
                checkInstalled(name.indexOf('/') !== -1);
            }
        }
    }

    npm.load(npmLoad, loadCallback);
};

npmi.LOAD_ERR    = LOAD_ERR;
npmi.INSTALL_ERR = INSTALL_ERR;
npmi.VIEW_ERR    = VIEW_ERR;

npmi.NPM_VERSION = npm.version;

module.exports = npmi;