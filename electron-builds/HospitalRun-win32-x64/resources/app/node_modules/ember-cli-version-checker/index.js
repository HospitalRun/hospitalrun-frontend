'use strict';

var fs = require('fs');
var path = require('path');
var semver = require('semver');

function getEmberCLIVersion(addon) {
  if (!addon.project || !addon.project.emberCLIVersion) {
    return null;
  }

  var version = addon.project.emberCLIVersion();

  // remove any meta-data, for dealing with `npm link`'ed ember-cli
  return version.split('-')[0];
}

function getVersionFromJSONFile(filePath) {
  if (fs.existsSync(filePath)) {
    var content = fs.readFileSync(filePath);

    try {
      return JSON.parse(content).version;
    } catch (exception) {
      return null;
    }
  }
}

/**
 * VersionChecker
 */
function VersionChecker(addon) {
  this._addon = addon;
}

VersionChecker.prototype.for = function(name, type) {
  if (type === 'bower') {
    return new BowerDependencyVersionChecker(this, name);
  } else if (type === 'npm') {
    return new NPMDependencyVersionChecker(this, name);
  }
};

VersionChecker.prototype.forEmber = function() {
  var emberVersionChecker = this.for('ember-source', 'npm');

  if (emberVersionChecker.version) {
    return emberVersionChecker;
  }

  return this.for('ember', 'bower');
};

/**
 * DependencyVersionChecker
 */
function DependencyVersionChecker(parent, name) {
  this._parent = parent;
  this.name = name;
}
Object.defineProperty(DependencyVersionChecker.prototype, 'version', {
  get: function() {

    if (this._version === undefined) {
      this._version = getVersionFromJSONFile(this._jsonPath);
    }

    if (this._version === undefined && this._fallbackJsonPath) {
      this._version = getVersionFromJSONFile(this._fallbackJsonPath);
    }

    return this._version;
  }
});

DependencyVersionChecker.prototype.isAbove = function isAbove(compareVersion) {
  if (!this.version) {
    return false;
  }
  return semver.gt(this.version, compareVersion);
}

var semverMethods = ['gt', 'lt', 'satisfies'];
semverMethods.forEach(function(method) {
  DependencyVersionChecker.prototype[method] = function(range) {
    if (!this.version) {
      return false;
    }
    return semver[method](this.version, range);
  };
});

DependencyVersionChecker.prototype.assertAbove = function assertAbove(compareVersion, _message) {
  var message = _message;

  if (!message) {
    message = 'The addon `' + this._parent._addon.name + '` requires the ' + this._type + ' package ' +
      '`' + this.name + '` to be above ' + compareVersion + ', but you have ' + this.version + '.';
  }

  if (!this.isAbove(compareVersion)) {
    var error  = new Error(message);

    error.suppressStacktrace = true;

    throw error;
  }
};

DependencyVersionChecker.prototype._super$constructor = DependencyVersionChecker;


/**
 * BowerDependencyVersionChecker
 */
function BowerDependencyVersionChecker() {
  this._super$constructor.apply(this, arguments);

  var addon = this._parent._addon;
  var project = addon.project;
  var bowerDependencyPath = path.join(project.root, project.bowerDirectory, this.name);

  this._jsonPath = path.join(bowerDependencyPath, '.bower.json');
  this._fallbackJsonPath = path.join(bowerDependencyPath, 'bower.json');
  this._type = 'bower';
}
BowerDependencyVersionChecker.prototype = Object.create(DependencyVersionChecker.prototype);

/**
 * NPMDependencyVersionChecker
 */
function NPMDependencyVersionChecker() {
  this._super$constructor.apply(this, arguments);
  var addon = this._parent._addon;
  var project = addon.project;
  var nodeModulesPath = project.nodeModulesPath || path.join(project.root, 'node_modules')
  var npmDependencyPath = path.join(nodeModulesPath, this.name);
  this._jsonPath = path.join(npmDependencyPath, 'package.json');
  this._type = 'npm';
}
NPMDependencyVersionChecker.prototype = Object.create(DependencyVersionChecker.prototype);

/**
 * EmberCLIDependencyVersionChecker
 */
function EmberCLIDependencyVersionChecker(addon) {
  // intentially not calling _super here
  this._version = getEmberCLIVersion(addon);
  this._type = 'npm';
}
EmberCLIDependencyVersionChecker.prototype = Object.create(DependencyVersionChecker.prototype);

/**
 * Backwards compatibility class methods
 *
 * They compare the version of ember-cli only.
 */
VersionChecker.isAbove = function deprecatedIsAbove(addon, comparisonVersion) {
  var dependencyChecker = new EmberCLIDependencyVersionChecker(addon);

  return dependencyChecker.satisfies('>=' + comparisonVersion);
};

VersionChecker.satisfies = function deprecatedSatisfies(addon, comparison) {
  var dependencyChecker = new EmberCLIDependencyVersionChecker(addon);

  return dependencyChecker.satisfies(comparison);
};
VersionChecker.assertAbove = function deprecatedAssertAbove(addon, comparisonVersion, _message) {
  var dependencyChecker = new EmberCLIDependencyVersionChecker(addon);
  var comparison = '>= ' + comparisonVersion;
  var message = _message;

  if (!message) {
    message = 'The addon `' + addon.name + '` requires an Ember CLI version of ' + comparisonVersion +
      ' or above, but you are running ' + dependencyChecker.version + '.';
  }

  if (!dependencyChecker.satisfies(comparison)) {
    var error  = new Error(message);

    error.suppressStacktrace = true;
    throw error;
  }
};

module.exports = VersionChecker;
