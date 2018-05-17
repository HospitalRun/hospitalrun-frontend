import { alias } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import Service, { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import createPouchViews from 'hospitalrun/utils/pouch-views';
import List from 'npm:pouchdb-list';
import OAuthHeaders from 'hospitalrun/mixins/oauth-headers';
import PouchAdapterMemory from 'npm:pouchdb-adapter-memory';
import PouchFindIndexes from 'hospitalrun/mixins/pouch-find-indexes';
import PouchDBUsers from 'npm:pouchdb-users';
import PouchDBWorker from 'npm:worker-pouch/client';
import UnauthorizedError from 'hospitalrun/utils/unauthorized-error';

export default Service.extend(OAuthHeaders, PouchFindIndexes, {
  mainDB: null, // Server DB
  oauthHeaders: null,
  requireLogin: true,
  setMainDB: false,
  usePouchFind: false,
  usersDB: null, // local users database for standAlone mode

  config: service(),
  standAlone: alias('config.standAlone'),

  createDB(configs) {
    let standAlone = get(this, 'standAlone');
    if (standAlone || !configs.config_external_search) {
      set(this, 'usePouchFind', true);
    }
    if (standAlone) {
      let localDb = this._createLocalDB();
      return RSVP.resolve(localDb);
    }
    return this._createMainDB(configs);
  },

  getDBInfo() {
    let mainDB = get(this, 'mainDB');
    return mainDB.info();
  },

  getDocFromMainDB(docId) {
    return new RSVP.Promise((resolve, reject) => {
      let mainDB = get(this, 'mainDB');
      mainDB.get(docId, (err, doc) => {
        if (err) {
          reject(this.handleErrorResponse(err));
        } else {
          resolve(doc);
        }
      });
    }, `getDocFromMainDB ${docId}`);
  },

  /**
  * Given an pouchDB doc id, return the corresponding ember record id.
  * @param {String} docId the pouchDB doc id.
  * @returns {String} the corresponding Ember id.
  */
  getEmberId(docId) {
    let parsedId = get(this, 'mainDB').rel.parseDocID(docId);
    if (!isEmpty(parsedId.id)) {
      return parsedId.id;
    }
  },

  /**
  * Given an record type, return back the maximum pouchdb id.  Useful for endkeys.
  * @param {String} type the record type.
  * @returns {String} the max pouch id for the type.
  */
  getMaxPouchId(type) {
    return this.getPouchId({}, type);
  },

  /**
  * Given an record type, return back the minimum pouchdb id.  Useful for startkeys.
  * @param {String} type the record type.
  * @returns {String} the min pouch id for the type.
  */
  getMinPouchId(type) {
    return this.getPouchId(null, type);
  },

  /**
  * Given an Ember record id and type, return back the corresponding pouchDB id.
  * @param {String} emberId the ember record id.
  * @param {String} type the record type.
  * @returns {String} the corresponding pouch id.
  */
  getPouchId(emberId, type) {
    let idInfo = {
      type
    };
    if (!isEmpty(emberId)) {
      idInfo.id = emberId;
    }
    return get(this, 'mainDB').rel.makeDocID(idInfo);
  },

  getRemoteDBUrl() {
    return `${document.location.protocol}//${document.location.host}/db/main`;
  },

  handleErrorResponse(err) {
    if (!err.status) {
      if (err.errors && err.errors.length > 0) {
        err.status = parseInt(err.errors[0].status);
      }
    }
    if (err.status === 401 || err.status === 403) {
      let detailedMessage = JSON.stringify(err, null, 2);
      return new UnauthorizedError(err, detailedMessage);
    } else {
      return err;
    }
  },

  /**
   * Load the specified db dump into the database.
   * @param {String} dbDump A couchdb dump string produced by pouchdb-dump-cli.
   * @returns {Promise} A promise that resolves once the dump has been loaded.
   */
  loadDBFromDump(dbDump) {
    return new RSVP.Promise((resolve, reject) => {
      PouchDB.plugin(PouchAdapterMemory);
      let db = new PouchDB('dbdump', {
        adapter: 'memory'
      });
      db.load(dbDump).then(() => {
        let mainDB = get(this, 'mainDB');
        db.replicate.to(mainDB).on('complete', (info) => {
          resolve(info);
        }).on('error', (err) => {
          reject(err);
        });
      }, reject);
    }, 'loadDBFromDump');
  },

  queryMainDB(queryParams, mapReduce) {
    return new RSVP.Promise((resolve, reject) => {
      let mainDB = get(this, 'mainDB');
      if (mapReduce) {
        mainDB.query(mapReduce, queryParams, (err, response) => {
          if (err) {
            reject(this.handleErrorResponse(err));
          } else {
            response.rows = this._mapPouchData(response.rows);
            resolve(response);
          }
        });
      } else {
        mainDB.allDocs(queryParams, (err, response) => {
          if (err) {
            reject(this.handleErrorResponse(err));
          } else {
            response.rows = this._mapPouchData(response.rows);
            resolve(response);
          }
        });
      }
    }, 'queryMainDB');
  },

  setup() {
    PouchDB.plugin(List);
    let config = get(this, 'config');
    return config.loadConfig().then((configs) => {
      return this.createDB(configs).then((db) => {
        set(this, 'mainDB', db);
        set(this, 'setMainDB', true);
        if (get(this, 'standAlone')) {
          return this.createUsersDB();
        } else {
          this.setupSubscription(configs);
        }
      });
    });
  },

  setupSubscription(configs) {
    if (!configs.config_disable_offline_sync && navigator.serviceWorker) {
      let config = get(this, 'config');
      let localDB = this._createLocalDB();
      return config.getConfigValue('push_subscription').then((pushSub) => {
        if (isEmpty(pushSub)) {
          return localDB.id().then((dbId) => {
            let dbInfo = {
              id: dbId,
              remoteSeq: 0
            };
            return this._getPermissionAndSubscribe(dbInfo);
          }).then(() => {
            return this._requestSync();
          });
        } else {
          return this._requestSync();
        }
      });
    }
  },

  _askPermission() {
    return new RSVP.Promise((resolve, reject) => {
      let permissionResult = Notification.requestPermission((result) => {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then((permissionResult) => {
      if (permissionResult !== 'granted') {
        throw new Error('We weren\'t granted permission.');
      }
      return permissionResult;
    }, 'Ask for notification permisson');
  },

  _createLocalDB(pouchOptions) {
    let localDB = new PouchDB('localMainDB', pouchOptions);
    createPouchViews(localDB);
    this.buildPouchFindIndexes(localDB);
    return localDB;
  },

  _createMainDB(configs) {
    this._setOAuthHeaders(configs);
    if (!configs.config_disable_offline_sync && navigator.serviceWorker) {
      // Use pouch-worker to run the DB in the service worker
      return navigator.serviceWorker.ready.then(() => {
        if (navigator.serviceWorker.controller && navigator.serviceWorker.controller.postMessage) {
          PouchDB.adapter('worker', PouchDBWorker);
          let localDB = this._createLocalDB({
            adapter: 'worker',
            worker: () => navigator.serviceWorker
          });
          return localDB;
        } else {
          return this._createRemoteDB(configs);
        }
      });
    } else {
      return this._createRemoteDB(configs);
    }
  },

  _createRemoteDB(configs) {
    let remoteUrl = this.getRemoteDBUrl();
    let pouchOptions = this._getOptions(configs);
    let remoteDB = new PouchDB(remoteUrl, pouchOptions);
    return remoteDB.info().then(()=> {
      createPouchViews(remoteDB);
      return remoteDB;
    }).catch((err) => {
      console.log('error with remote db:', JSON.stringify(err, null, 2));
      throw err;
    });
  },

  _getNotificationPermissionState() {
    if (navigator.permissions) {
      return navigator.permissions.query({ name: 'notifications' })
        .then((result) => {
          return result.state;
        });
    }
    return RSVP.resolve(Notification.permission);
  },

  _getPermissionAndSubscribe(dbInfo) {
    return new RSVP.Promise((resolve, reject) => {
      navigator.serviceWorker.ready.then((registration) => {
        return this._getNotificationPermissionState().then((permission) => {
          if (permission !== 'granted') {
            return this._askPermission().then(() => {
              return this._subscribeUserToPush(registration, dbInfo).then(resolve, reject);
            });
          } else {
            return this._subscribeUserToPush(registration, dbInfo).then(resolve, reject);
          }
        });
      });
    }, 'Get notification permission and subscribe to push');
  },

  _urlBase64ToUint8Array(base64String) {
    let padding = '='.repeat((4 - base64String.length % 4) % 4);
    let base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    let rawData = window.atob(base64);
    let outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  _sendSubscriptionToServer(subscription, dbInfo) {
    return new RSVP.Promise((resolve, reject) => {
      return fetch('/save-subscription/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          dbInfo,
          subscription
        })
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Bad status code from server.');
        }
        return response.json();
      }).then((responseData) => {
        if (responseData.ok !== true) {
          throw new Error('There was a bad response from server.', JSON.stringify(responseData, null, 2));
        }
        resolve(responseData);
      }).catch(reject);
    }, 'Send push subscription to server');
  },

  _subscribeUserToPush(registration, dbInfo) {
    let config = get(this, 'config');
    return config.getConfigValue('push_public_key').then((serverKey) => {
      if (!serverKey) {
        return;
      }
      let subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: this._urlBase64ToUint8Array(serverKey)
      };
      return new RSVP.Promise((resolve, reject) => {
        return registration.pushManager.subscribe(subscribeOptions)
          .then((pushSubscription) => {
            let subInfo = JSON.stringify(pushSubscription);
            subInfo = JSON.parse(subInfo);
            return this._sendSubscriptionToServer(subInfo, dbInfo);
          }).then((savedSubscription) => {
            let configDB = config.getConfigDB();
            return configDB.put({
              _id: 'config_push_subscription',
              value: savedSubscription.id
            }).then(resolve, reject);
          }).catch(reject);
      });
    }, 'Subscribe user to push service.');
  },

  _requestSync() {
    return new RSVP.Promise((resolve, reject) => {
      let messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = function(event) {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };
      navigator.serviceWorker.controller.postMessage('remotesync', [messageChannel.port2]);
    }, 'Request offline sync');
  },

  createUsersDB() {
    PouchDB.plugin(PouchDBUsers);
    let usersDB = new PouchDB('_users');
    return usersDB.installUsersBehavior().then(() => {
      set(this, 'usersDB', usersDB);
      return usersDB.allDocs().then((results) => {
        if (results.total_rows < 2) {
          set(this, 'requireLogin', false);
          if (results.total_rows === 0) {

            return usersDB.put({
              _id: 'org.couchdb.user:hradmin',
              type: 'user',
              name: 'hradmin',
              password: 'test',
              roles: ['System Administrator', 'admin', 'user'],
              userPrefix: 'p1'
            });
          }
        }
      });
    });
  },

  _getOptions(configs) {
    let pouchOptions = {};
    if (configs) {
      pouchOptions.ajax = {
        timeout: 30000
      };
      // If we don't have the proper credentials, throw error to force login.
      if (isEmpty(configs.config_consumer_key)
        || isEmpty(configs.config_consumer_secret)
        || isEmpty(configs.config_oauth_token)
        || isEmpty(configs.config_token_secret)) {
        throw Error('login required');
      } else {
        let headers = get(this, 'oauthHeaders');
        pouchOptions.ajax.headers = headers;
      }
    }
    return pouchOptions;
  },

  _mapPouchData(rows) {
    let mappedRows = [];
    if (rows) {
      mappedRows = rows.map((row) => {
        if (row.doc) {
          let rowValues = {
            doc: row.doc.data
          };
          rowValues.doc.id = this.getEmberId(row.id);
          return rowValues;
        } else {
          return row;
        }
      });
    }
    return mappedRows;
  },

  _setOAuthHeaders(configs) {
    let headers = this.getOAuthHeaders(configs);
    set(this, 'oauthHeaders', headers);
  }

});
