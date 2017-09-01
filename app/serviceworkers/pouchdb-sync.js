let allChanges = {};
let configs = false;
let syncingRemote = false;
let configDB = new PouchDB('config');
let localMainDB = new PouchDB('localMainDB');
let lastServerSeq;

function PouchError(opts) {
  Error.call(opts.reason);
  this.status = opts.status;
  this.name = opts.error;
  this.message = opts.reason;
  this.error = true;
}

function createError(err) {
  let status = err.status || 500;

  // last argument is optional
  if (err.name && err.message) {
    if (err.name === 'Error' || err.name === 'TypeError') {
      if (err.message.indexOf('Bad special document member') !== -1) {
        err.name = 'doc_validation';
        // add more clauses here if the error name is too general
      } else {
        err.name = 'bad_request';
      }
    }
    err = {
      error: err.name,
      name: err.name,
      reason: err.message,
      message: err.message,
      status
    };
  }
  return err;
}

function safeEval(str) {
  let target = {};
  /* jshint evil: true */
  eval(`target.target = (${str});`);
  return target.target;
}

function decodeArgs(args) {
  let funcArgs = ['filter', 'map', 'reduce'];
  args.forEach(function(arg) {
    if (typeof arg === 'object' && arg !== null && !Array.isArray(arg)) {
      funcArgs.forEach(function(funcArg) {
        if (!(funcArg in arg) || arg[funcArg] === null) {
          delete arg[funcArg];
        } else if (arg[funcArg].type === 'func' && arg[funcArg].func) {
          arg[funcArg] = safeEval(arg[funcArg].func);
        }
      });
    }
  });
  return args;
}

function postMessage(msg, event) {
  event.ports[0].postMessage(msg);
}

function sendError(clientId, messageId, data, event) {
  logDebug(' -> sendError', clientId, messageId, data);
  postMessage({
    type: 'error',
    id: clientId,
    messageId,
    content: createError(data)
  }, event);
}

function sendSuccess(clientId, messageId, data, event) {
  logDebug(' -> sendSuccess', clientId, messageId);
  postMessage({
    type: 'success',
    id: clientId,
    messageId,
    content: data
  }, event);
}

function sendUpdate(clientId, messageId, data, event) {
  logDebug(' -> sendUpdate', clientId, messageId);
  postMessage({
    type: 'update',
    id: clientId,
    messageId,
    content: data
  }, event);
}

function getCurrentDB(clientId) {
  switch (clientId) {
    case 'localMainDB': {
      return Promise.resolve(localMainDB);
    }
    case 'hospitalrun-test-database': {
      return  Promise.resolve(new PouchDB('hospitalrun-test-database', {
        adapter: 'memory'
      }));
    }
    default: {
      return getRemoteDB();
    }
  }
}

function dbMethod(clientId, methodName, messageId, args, event) {
  let dbAdapter;
  return getCurrentDB(clientId).then((db) => {
    if (!db) {
      return sendError(clientId, messageId, { error: 'db not found' }, event);
    }
    dbAdapter = db.adapter;
    return db[methodName](...args);
  }).then(function(res) {
    sendSuccess(clientId, messageId, res, event);
    switch (methodName) {
      case 'put':
      case 'bulkDocs':
      case 'post':
      case 'remove':
      case 'removeAttachment':
      case 'putAttachment':
        remoteSync();
    }
  }).catch(function(err) {
    if (dbAdapter === 'http') {
      // If the failure was on http, retry with local db.
      return dbMethod('localMainDB', methodName, messageId, args, event);
    } else {
      sendError(clientId, messageId, err, event);
    }
  });
}

function changes(clientId, messageId, args, event) {
  let [opts] = args;
  if (opts && typeof opts === 'object') {
    // just send all the docs anyway because we need to emit change events
    // TODO: be smarter about emitting changes without building up an array
    opts.returnDocs = true;
    opts.return_docs = true;
  }
  dbMethod(clientId, 'changes', messageId, args, event);
}

function createDatabase(clientId, messageId, args, event) {
  return sendSuccess(clientId, messageId, { ok: true, exists: true }, event);
}

function getAttachment(clientId, messageId, args, event) {
  return getCurrentDB(clientId).then((db) => {
    if (!db) {
      return sendError(clientId, messageId, { error: 'db not found' }, event);
    }
    let [docId, attId, opts] = args;
    if (typeof opts !== 'object') {
      opts = {};
    }
    return db.get(docId, opts).then(function(doc) {
      if (!doc._attachments || !doc._attachments[attId]) {
        throw new PouchError({
          status: 404,
          error: 'not_found',
          reason: 'missing'
        });
      }
      return db.getAttachment(...args).then(function(buff) {
        sendSuccess(clientId, messageId, buff, event);
      });
    });
  }).catch(function(err) {
    sendError(clientId, messageId, err, event);
  });
}

function destroy(clientId, messageId, args, event) {
  if (clientId === 'hospitalrun-test-database') {
    getCurrentDB(clientId).then((db) => {
      if (!db) {
        return sendError(clientId, messageId, { error: 'db not found' }, event);
      }
      Promise.resolve().then(() => {
        return db.destroy(...args);
      }).then((res) => {
        sendSuccess(clientId, messageId, res, event);
      }).catch((err) => {
        sendError(clientId, messageId, err, event);
      });
    });
  } else {
    return sendError(clientId, messageId, { error: 'permission denied' }, event);
  }
}

function liveChanges(clientId, messageId, args, event) {
  getCurrentDB(clientId).then((db) => {
    if (!db) {
      return sendError(clientId, messageId, { error: 'db not found' }, event);
    }
    let changes = db.changes(args[0]);
    allChanges[messageId] = changes;
    changes.on('change', function(change) {
      sendUpdate(clientId, messageId, change, event);
    }).on('complete', function(change) {
      changes.removeAllListeners();
      delete allChanges[messageId];
      sendSuccess(clientId, messageId, change, event);
    }).on('error', function(change) {
      changes.removeAllListeners();
      delete allChanges[messageId];
      sendError(clientId, messageId, change, event);
    });
  });
}

function cancelChanges(messageId) {
  let changes = allChanges[messageId];
  if (changes) {
    changes.cancel();
  }
}

function onReceiveMessage(clientId, type, messageId, args, event) {
  switch (type) {
    case 'createDatabase':
      return createDatabase(clientId, messageId, args, event);
    case 'id':
      sendSuccess(clientId, messageId, clientId, event);
      return;
    case 'info':
    case 'put':
    case 'allDocs':
    case 'bulkDocs':
    case 'post':
    case 'get':
    case 'remove':
    case 'revsDiff':
    case 'compact':
    case 'viewCleanup':
    case 'removeAttachment':
    case 'putAttachment':
    case 'query':
      return dbMethod(clientId, type, messageId, args, event);
    case 'changes':
      return changes(clientId, messageId, args, event);
    case 'getAttachment':
      return getAttachment(clientId, messageId, args, event);
    case 'liveChanges':
      return liveChanges(clientId, messageId, args, event);
    case 'cancelChanges':
      return cancelChanges(messageId);
    case 'destroy':
      return destroy(clientId, messageId, args, event);
    default:
      return sendError(clientId, messageId, { error: `unknown API method: ${type}` }, event);
  }
}

function handleMessage(message, clientId, event) {
  let { type, messageId } = message;
  let args = decodeArgs(message.args);
  onReceiveMessage(clientId, type, messageId, args, event);
}

self.addEventListener('push', function(event) {
  if (event.data) {
    let pushData =  event.data.json();
    if (pushData.type === 'couchDBChange') {
      logDebug(`Got couchDBChange pushed, attempting to sync to: ${pushData.seq}`);
      event.waitUntil(
        remoteSync(pushData.seq).then((resp) => {
          logDebug(`Response from sync ${JSON.stringify(resp, null, 2)}`);
        })
      );
    } else {
      logDebug('Unknown push event has data and here it is: ', pushData);
    }
  }
});

self.addEventListener('message', function(event) {
  logDebug('got message', event);
  if (event.data === 'remotesync') {
    remoteSync();
    return;
  }
  if (!event.data || !event.data.id || !event.data.args
      || !event.data.type || !event.data.messageId) {
    // assume this is not a message from worker-pouch
    // (e.g. the user is using the custom API instead)
    return;
  }
  let clientId = event.data.id;
  if (event.data.type === 'close') {
    // logDebug('closing worker', clientId);
  } else {
    handleMessage(event.data, clientId, event);
  }
});

self.addEventListener('sync', function(event) {
  if (event.tag === 'remoteSync') {
    event.waitUntil(remoteSync(null, true).catch((err) =>{
      if (event.lastChance) {
        logDebug('Sync failed for the last time, so give up for now.', err);
      } else {
        logDebug('Sync failed, will try again later', err);
      }
    }));
  }
});

function getRemoteDB() {
  return setupConfigs().then(() => {
    let pouchOptions = {
      ajax: {
        headers: {},
        timeout: 30000
      }
    };
    if (configs.config_consumer_secret && configs.config_token_secret
      && configs.config_consumer_key && configs.config_oauth_token) {
      pouchOptions.ajax.headers['x-oauth-consumer-secret'] = configs.config_consumer_secret;
      pouchOptions.ajax.headers['x-oauth-consumer-key'] = configs.config_consumer_key;
      pouchOptions.ajax.headers['x-oauth-token-secret'] = configs.config_token_secret;
      pouchOptions.ajax.headers['x-oauth-token'] = configs.config_oauth_token;
    }
    let remoteURL = `${self.location.protocol}//${self.location.host}/db/main`;
    return new PouchDB(remoteURL, pouchOptions);
  });
}

function remoteSync(remoteSequence, retryingSync) {
  lastServerSeq = remoteSequence;
  if (!syncingRemote && configs.config_disable_offline_sync !== true) {
    logDebug(`Synching local db to remoteSequence: ${remoteSequence} at: ${new Date()}`);
    syncingRemote = true;
    return getRemoteDB().then((remoteDB) => {
      return localMainDB.sync(remoteDB);
    }).then((info) => {
      syncingRemote = false;
      logDebug('local sync complete:', info, configs);

      // Update push subscription with latest sync info
      fetch('/update-subscription/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: configs.config_push_subscription,
          remoteSeq: info.pull.last_seq
        })
      });
      // handle complete
      if (info.pull.last_seq < lastServerSeq) {
        return remoteSync(lastServerSeq);
      } else {

        return true;
      }
    }).catch((err) => {
      syncingRemote = false;
      logDebug(`local sync error, register remote sync: ${new Date()}`, err);
      if (retryingSync) {
        throw err;
      } else {
        self.registration.sync.register('remoteSync');
      }
    });
  } else {
    if (syncingRemote) {
      logDebug(`Skipping sync to: ${remoteSequence} because sync is in process`);
    }
    return Promise.resolve(false);
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
