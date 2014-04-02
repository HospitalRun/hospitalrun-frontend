export default Ember.SimpleAuth.Authenticators.Base.extend({
    
  /**
    Authenticates the session with the specified `credentials`; the credentials
    are `POST`ed to the `serverTokenEndpoint` and if they are valid the server
    returns an access token in response (see
    http://tools.ietf.org/html/rfc6749#section-4.3). __If the credentials are
    valid and authentication succeeds, a promise that resolves with the
    server's response is returned__, otherwise a promise that rejects with the
    error is returned.

    This method also schedules automatic token refreshing when there are values
    for `refresh_token` and `expires_in` in the server response and automatic
    token refreshing is not disabled (see
    [Ember.SimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#Ember-SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

    @method authenticate
    @param {Object} credentials The credentials to authenticate the session with
    @return {Ember.RSVP.Promise} A promise that resolves when an access token is successfully acquired from the server and rejects otherwise
  */
    authenticate: function(credentials) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var data = { name: credentials.identification, password: credentials.password };
            _this.makeRequest('POST', data).then(function(response) {
                Ember.run(function() {
                    var expiresAt = _this.absolutizeExpirationTime(600);
                    resolve(Ember.$.extend(response, { expires_at: expiresAt }));
                });
            }, function(xhr, status, error) {
                Ember.run(function() {
                    reject(xhr.responseJSON || xhr.responseText);
                });
            });
        }); 
    },
    
    serverEndpoint: 'http://0.0.0.0:5984/_session',

    makeRequest: function(type, data) {
        return Ember.$.ajax({
            url:         this.serverEndpoint,
            type:        type,
            data:        data,
            dataType:    'json',
            contentType: 'application/x-www-form-urlencoded',
            //crossDomain: true,
            xhrFields: {
                withCredentials: true
            }
        });
    },

    invalidate: function() {
        return this.getPromise('DELETE');
    },
    
    getPromise: function(data, type) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
            _this.makeRequest(data, type).then(function(response, status, xhr) {
                Ember.run(function() {
                    resolve(response);
                });
            }, function(xhr, status, error) {
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
