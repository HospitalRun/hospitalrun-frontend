var config = require('../config.js'),
    forward = require('../forward.js'),
    request = require('request');

function _createMapFunction(type, query) {
  var mapFunction = 'function(doc) {' +
      'var found_doc = false,' +
      '   doctype, ' +
      '   queryValue, ' +
      '   uidx;' +
      'if (doc._id && (uidx = doc._id.indexOf("_")) > 0) {' +
          'doctype = doc._id.substring(0, uidx);' +
          'if(doctype === "' + type + '") {';
  query.forEach(function(query) {
    var queryParts = query.split(':');
    if (queryParts.length === 2) {
      var key = queryParts[0],
          value = queryParts[1];
      mapFunction += 'queryValue = "' + value.toLowerCase() + '";';
      mapFunction += 'if (doc.data["' + key + '"] && doc.data["' + key + '"].toLowerCase().indexOf(queryValue) >= 0) {' +
          'found_doc = true;' +
      '}';
    }
  });
  mapFunction += 'if (found_doc === true) {' +
      'emit(doc._id, null);' +
  '}' +
'}' +
'}' +
'}';
  return {
    map: mapFunction
  };
}

function slowSearch(pattern, dburl) {
  return function(req, res, next) {
    if (req.url.match(pattern)) {
      var model = req.url.match(pattern)[1],
          searchUrl = dburl + '/main/_temp_view/?include_docs=true',
          query = decodeURIComponent(req.url.match(pattern)[2]);
      var queryParts = query.split('+OR+');
      var requestOptions = {
        body: _createMapFunction(model,  queryParts),
        json: true,
        method: 'post',
        url: searchUrl
      };
      req.pipe(request(requestOptions)).pipe(res);
    } else {
      next();
    }
  };
}

module.exports = function(app) {
  if (config.search_url) {
    app.use(forward(/\/search\/(.*)/, config.search_url));
  } else {
    app.use(slowSearch(/\/search\/hrdb\/(.*)\/_search\?q=(.*)/, config.couch_db_url));
  }
};