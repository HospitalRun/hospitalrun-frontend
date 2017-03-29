var Filter = require('broccoli-persistent-filter');
var Minimatch = require('minimatch').Minimatch;

function SimpleReplace (inputTree, options) {
  if (!(this instanceof SimpleReplace)) return new SimpleReplace(inputTree, options);

  Filter.call(this, inputTree, options); // this._super()

  options = options || {};

  this.inputTree   = inputTree;
  this.files       = options.files || [];
  this.files       = this.files.map(this._processPattern);
  this.patterns    = options.patterns;
  this.description = options.description;

  if (options.patterns) {
    this.patterns = options.patterns;
  } else if (options.pattern) {
    this.patterns = [options.pattern];
  } else {
    this.patterns = [];
  }
};

SimpleReplace.prototype = Object.create(Filter.prototype);
SimpleReplace.prototype.constructor = SimpleReplace;

SimpleReplace.prototype._processPattern = function(pattern) {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  var type = typeof pattern;
  if (type === 'string') {
    return new Minimatch(pattern);
  }
  if (type === 'function') {
    return pattern;
  }
  throw new Error('files patterns can be a RegExp, glob string, or function. You supplied `' + typeof pattern +'`.');
};

SimpleReplace.prototype.canProcessFile = function (relativePath) {
  var len = this.files.filter(function(pattern) {
    if (pattern instanceof RegExp) {
      return pattern.test(relativePath);
    } else if (pattern instanceof Minimatch) {
      return pattern.match(relativePath);
    } else if (typeof pattern === 'function') {
      return pattern(relativePath);
    }
    return false;
  }).length;
  return len;
}

SimpleReplace.prototype.getDestFilePath = function(relativePath) {
  return relativePath;
};

SimpleReplace.prototype.processString = function (str) {
  for (var i = 0, l = this.patterns.length; i < l; i++) {
    var pattern = this.patterns[i];

    str = str.replace(pattern.match, pattern.replacement);
  }

  return str;
};

module.exports = SimpleReplace;
