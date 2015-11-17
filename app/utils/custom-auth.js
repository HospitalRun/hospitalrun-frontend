import Ember from "ember";
export default Ember.SimpleAuth.Authenticators.Base.extend({
    serverEndpoint: '/db/_session',    
    useGoogleAuth: false,
    
    /**
      @method absolutizeExpirationTime
      @private
    */
    _absolutizeExpirationTime: function(expiresIn) {
        if (!Ember.isEmpty(expiresIn)) {
            return new Date((new Date().getTime()) + (expiresIn - 5) * 1000).getTime();
        }
    },
    
    _checkUser: function(user, resolve, reject) {
        this._makeRequest('POST', {name: user.name}, '/chkuser').then(function(response) {
            Ember.run(function() {
                if(response.error) {
                    reject(response);
                }
                user.displayName = response.displayName;
                user.role = response.role;
                user.prefix = response.prefix;
                resolve(user);
            });
        }, function() {
            Ember.run(function() {
                //If chkuser fails, user is probably offline; resolve with currently stored credentials
                resolve(user);
            });
        });               
    },
    
    _getPromise: function(type, data) {        
        return new Ember.RSVP.Promise(function(resolve, reject) {
            this._makeRequest(type, data).then(function(response) {
                Ember.run(function() {
                    resolve(response);
                });
            }, function(xhr) {
                Ember.run(function() {
                    reject(xhr.responseJSON || xhr.responseText);
                });
            });
        }.bind(this));
    },
    

    _makeRequest: function(type, data, url) {
        if (!url) {
            url = this.serverEndpoint;
        }
        return Ember.$.ajax({
            url:         url,
            type:        type,
            data:        data,
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            }
        });
    },
    
    
    /**
     Authenticate using google auth credentials or credentials from couch db.
     @method authenticate
     @param {Object} credentials The credentials to authenticate the session with
     @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
     */
    authenticate: function(credentials) {
        if (credentials.google_auth) {
            this.useGoogleAuth = true;
            var session_credentials = {
                google_auth: true,
                consumer_key: credentials.params.k,
                consumer_secret: credentials.params.s1,
                token: credentials.params.t,
                token_secret: credentials.params.s2,
                name: credentials.params.i
            };
            return new Ember.RSVP.Promise(function(resolve, reject) {
                this._checkUser(session_credentials, resolve, reject);
            }.bind(this));
        }            
        
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var data = { name: credentials.identification, password: credentials.password };
            this._makeRequest('POST', data).then(function(response) {
                Ember.run(function() {
                    response.name = data.name;
                    response.expires_at = this._absolutizeExpirationTime(600);
                    this._checkUser(response, function(user) {
                        var pouchDBController = this.get('pouchDBController');
                        pouchDBController.setupMainDB({}).then(function() {
                            resolve(user);
                        }, reject);
                    }.bind(this), reject);
                }.bind(this));
            }.bind(this), function(xhr) {
                Ember.run(function() {
                    reject(xhr.responseJSON || xhr.responseText);
                }.bind(this));
            }.bind(this));
        }.bind(this)); 
    },
    
    invalidate: function() {
        if (this.useGoogleAuth) {
            return new Ember.RSVP.resolve();
        } else {
            return this._getPromise('DELETE');
        }
    },
        
    restore: function(data) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var now = (new Date()).getTime();
            if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
                reject();
            } else {
                if (data.google_auth) {
                    this.useGoogleAuth = true;
                }
                this._checkUser(data, resolve, reject);                                
            }
        }.bind(this));
    }
        
});
