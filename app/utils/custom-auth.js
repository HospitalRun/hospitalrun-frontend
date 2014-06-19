export default Ember.SimpleAuth.Authenticators.Base.extend({
    
    use_google_auth: false,
    
    /**
     Authenticate using google auth credentials or credentials from couch db.
     @method authenticate
     @param {Object} credentials The credentials to authenticate the session with
     @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
     */
    authenticate: function(credentials) {
        if (credentials.google_auth) {
            this.use_google_auth = true;
            var session_credentials = {
                google_auth: true,
                consumer_key: credentials.params.k,
                consumer_secret: credentials.params.s1,
                token: credentials.params.t,
                token_secret: credentials.params.s2,
                name: credentials.params.i
            };
            return Ember.RSVP.resolve(session_credentials);
        }            
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var data = { name: credentials.identification, password: credentials.password };
            _this.makeRequest('POST', data).then(function(response) {
                Ember.run(function() {
                    var expiresAt = _this.absolutizeExpirationTime(600);
                    resolve(Ember.$.extend(response, { expires_at: expiresAt }));
                });
            }, function(xhr) {
                Ember.run(function() {
                    reject(xhr.responseJSON || xhr.responseText);
                });
            });
        }); 
    },
    
    serverEndpoint: '/db/_session',

    makeRequest: function(type, data) {
        return Ember.$.ajax({
            url:         this.serverEndpoint,
            type:        type,
            data:        data,
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded',
            xhrFields: {
                withCredentials: true
            }
        });
    },

    invalidate: function() {
        if (this.use_google_auth) {
            return new Ember.RSVP.resolve();
        } else {
            return this.getPromise('DELETE');
        }
    },
    
    getPromise: function(data, type) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            _this.makeRequest(data, type).then(function(response) {
                Ember.run(function() {
                    resolve(response);
                });
            }, function(xhr) {
                Ember.run(function() {
                    reject(xhr.responseJSON || xhr.responseText);
                });
            });
        });
    },
    
    restore: function(data) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {            
            var now = (new Date()).getTime();
            if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
                reject();
            } else {
                if (data.google_auth) {
                    _this.use_google_auth = true;
                }
                resolve(data);
            }
        });        
    },
    
    
  /**
    @method absolutizeExpirationTime
    @private
  */
    absolutizeExpirationTime: function(expiresIn) {
        if (!Ember.isEmpty(expiresIn)) {
            return new Date((new Date().getTime()) + (expiresIn - 5) * 1000).getTime();
        }
    }
        
});
