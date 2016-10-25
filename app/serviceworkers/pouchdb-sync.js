
let configs = false;
let syncingRemote = false;
let configDB = new PouchDB('config');
let localMainDB = new PouchDB('localMainDB');

toolbox.router.get('/db/main/', function(request, values, options) {
  logDebug('request for main info:', request.url);
  return couchDBResponse(request, values, options, function() {
    return localMainDB.info();
  });
});

toolbox.router.get('/db/main/_all_docs', function(request, values, options) {
  logDebug('request for all docs:', request.url);
  return couchDBResponse(request, values, options, function(request) {
    let options = getDBOptions(request.url);
    logDebug('allDocs PouchDB:', options);
    return localMainDB.allDocs(options);
  });
});
toolbox.router.get('/db/main/_design/:design_doc/_view/:view', function(request, values, options) {
  logDebug('request for view:', request.url);
  return couchDBResponse(request, values, options, function(request) {
    let options = getDBOptions(request.url);
    let mapReduce = `${values.design_doc}/${values.view}`;
    logDebug('queryPouchDB:', mapReduce, options);
    return localMainDB.query(mapReduce, options);
  });
});

toolbox.router.post('/db/main/_bulk_docs', function(request, values, options) {
  logDebug('request for bulk docs:', request.url);
  let pouchRequest = request.clone();
  return couchDBResponse(request, values, options, function() {
    logDebug('couch failed, trying pouch request:', request.url);
    return pouchRequest.json().then(function(jsonRequest) {
      logDebug('got bulk docs, jsonRequest is:', jsonRequest);
      return localMainDB.bulkDocs(jsonRequest);
    }).catch(function(err) {
      logDebug('err getting json: ', err);
    });
  });
});

function setupRemoteSync() {
  if (!syncingRemote && configs.config_disable_offline_sync !== true) {
    let pouchOptions = {
      ajax: {
        headers: {},
        timeout: 30000
      }
    };
    if (configs.config_consumer_secret && configs.config_token_secret &&
        configs.config_consumer_key && configs.config_oauth_token) {
      pouchOptions.ajax.headers['x-oauth-consumer-secret'] = configs.config_consumer_secret;
      pouchOptions.ajax.headers['x-oauth-consumer-key'] = configs.config_consumer_key;
      pouchOptions.ajax.headers['x-oauth-token-secret'] = configs.config_token_secret;
      pouchOptions.ajax.headers['x-oauth-token'] = configs.config_oauth_token;
    }
    let remoteURL = `${self.location.protocol}//${self.location.host}/db/main`;
    let remoteDB = new PouchDB(remoteURL, pouchOptions);
    syncingRemote = localMainDB.sync(remoteDB, {
      live: true,
      retry: true
    }).on('change', function(info) {
      logDebug('local sync change', info);
    }).on('paused', function() {
      logDebug('local sync paused');
      // replication paused (e.g. user went offline)
    }).on('active', function() {
      logDebug('local sync active');
      // replicate resumed (e.g. user went back online)
    }).on('denied', function(info) {
      logDebug('local sync denied:', info);
      // a document failed to replicate, e.g. due to permissions
    }).on('complete', function(info) {
      logDebug('local sync complete:', info);
      // handle complete
    }).on('error', function(err) {
      logDebug('local sync error:', err);
    });
  }
}

function setupConfigs() {
  return new Promise(function(resolve, reject) {
    if (configs) {
      resolve();
    } else {
      configDB.allDocs({
        include_docs: true
      }).then((result) => {
        configs = {};
        result.rows.forEach((row) => {
          configs[row.id] = row.doc.value;
        });
        resolve();
      }, reject);
    }
  });
}

function couchDBResponse(request, values, options, pouchDBFn) {
  setupConfigs().then(setupRemoteSync).catch(function(err) {
    logDebug('Error setting up remote sync', JSON.stringify(err, null, 2));
  });
  logDebug('Looking for couchdb response for:', request.url);
  return new Promise(function(resolve, reject) {
    let startTime = performance.now();
    toolbox.networkOnly(request, values, options).then(function(response) {
      if (response) {
        let elapsedTime = performance.now() - startTime;
        resolve(response);
        logPerformance(elapsedTime, request.url);
      } else {
        logDebug('Network first returned no response, get data from local pouch db.');
        runPouchFn(pouchDBFn, request, resolve, reject);
      }
    }).catch(function(err) {
      logDebug('Network first returned err, get data from local pouch db:', err);
      runPouchFn(pouchDBFn, request, resolve, reject);
    });
  });
}

function convertPouchToResponse(pouchResponse) {
  return new Response(JSON.stringify(pouchResponse), {
    status: 200,
    statusText: 'OK'
  });
}

function getDBOptions(url) {
  let returnParams = {};
  if (url.indexOf('?') > 0) {
    let urlParams = url.split('?');
    let params = decodeURIComponent(urlParams[1]).split('&');
    for (let i = 0; i < params.length; i++) {
      let paramParts = params[i].split('=');
      returnParams[paramParts[0]] = JSON.parse(paramParts[1]);
    }
  }
  return returnParams;
}

function logPerformance(elapsedTime, requestUrl) {
  if (configs.config_log_metrics && configs.current_user) {
    let now = Date.now();
    let timingId = `timing_${configs.current_user.toLowerCase()}_${now}`;
    localMainDB.put({
      _id: timingId,
      elapsed: elapsedTime,
      url: requestUrl
    });
  }
}

function runPouchFn(pouchDBFn, request, resolve, reject) {
  if (configs.disable_offline_sync) {
    reject('Offline access has been disabled.');
  } else {
    pouchDBFn(request).then(function(response) {
      resolve(convertPouchToResponse(response));
    }).catch(function(err) {
      logDebug('POUCH error is:', err);
      reject(err);
    });
  }
}
