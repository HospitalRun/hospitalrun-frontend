'use strict';

module.exports = function(str) {
  if (typeof str !== 'string') { return; }

  // Special case for PhantomJS
  if (str.toLowerCase() === 'phantomjs') {
    return 'PhantomJS';
  }

  return str.replace(/\w+/g, function(word) {
    return word.replace(/^[a-z]/, function(firstCharacter) {
      return firstCharacter.toUpperCase();
    });
  });
};
