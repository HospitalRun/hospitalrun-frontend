(function(global) {

var define, requireModule;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requireModule = function(name) {
    if (seen.hasOwnProperty(name)) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };

  requireModule.registry = registry;
})();

define("ember-simple-auth", 
  ["./ember-simple-auth/core","./ember-simple-auth/session","./ember-simple-auth/authenticators","./ember-simple-auth/authorizers","./ember-simple-auth/stores","./ember-simple-auth/mixins/application_route_mixin","./ember-simple-auth/mixins/authenticated_route_mixin","./ember-simple-auth/mixins/authentication_controller_mixin","./ember-simple-auth/mixins/login_controller_mixin","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __exports__) {
    "use strict";
    var setup = __dependency1__.setup;
    var Configuration = __dependency1__.Configuration;
    var Session = __dependency2__.Session;
    var Authenticators = __dependency3__.Authenticators;
    var Authorizers = __dependency4__.Authorizers;
    var Stores = __dependency5__.Stores;
    var ApplicationRouteMixin = __dependency6__.ApplicationRouteMixin;
    var AuthenticatedRouteMixin = __dependency7__.AuthenticatedRouteMixin;
    var AuthenticationControllerMixin = __dependency8__.AuthenticationControllerMixin;
    var LoginControllerMixin = __dependency9__.LoginControllerMixin;

    /**
      Ember.SimpleAuth's main module.

      @module Ember.SimpleAuth
    */

    __exports__.setup = setup;
    __exports__.Configuration = Configuration;
    __exports__.Session = Session;
    __exports__.Authenticators = Authenticators;
    __exports__.Authorizers = Authorizers;
    __exports__.Stores = Stores;
    __exports__.ApplicationRouteMixin = ApplicationRouteMixin;
    __exports__.AuthenticatedRouteMixin = AuthenticatedRouteMixin;
    __exports__.AuthenticationControllerMixin = AuthenticationControllerMixin;
    __exports__.LoginControllerMixin = LoginControllerMixin;
  });
define("ember-simple-auth/authenticators", 
  ["./authenticators/base","./authenticators/oauth2","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var OAuth2 = __dependency2__.OAuth2;

    var Authenticators = Ember.Namespace.create({
      Base:   Base,
      OAuth2: OAuth2
    });

    __exports__.Authenticators = Authenticators;
  });
define("ember-simple-auth/authenticators/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The base for all authenticators. __This serves as a starting point for
      implementing custom authenticators and must not be used directly.__

      The authenticator acquires all data that makes up the session. The actual
      mechanism used to do this might e.g. be posting a set of credentials to a
      server and in exchange retrieving an access token, initiating authentication
      against an external provider like Facebook etc. and depends on the specific
      authenticator. Any data that the authenticator receives upon successful
      authentication and resolves with grom the
      [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
      method is stored in the session and can then be used by the authorizer (see
      [Ember.SimpleAuth.Authorizers.Base](#Ember-SimpleAuth-Authorizers-Base)).

      Authenticators may trigger the `'ember-simple-auth:session-updated'` event
      when any of the session properties change. The session listens to that event
      and will handle the changes accordingly.

      __Custom authenticators have to be registered with Ember's dependency
      injection container__ so that the session can retrieve an instance, e.g.:

      ```javascript
      var CustomAuthenticator = Ember.SimpleAuth.Authenticators.Base.extend({
        ...
      });
      Ember.Application.initializer({
        name: 'authentication',
        initialize: function(container, application) {
          container.register('app:authenticators:custom', CustomAuthenticator);
          Ember.SimpleAuth.setup(container, application);
        }
      });
      ```

      @class Base
      @namespace Authenticators
      @extends Ember.Object
      @uses Ember.Evented
    */
    var Base = Ember.Object.extend(Ember.Evented, {
      /**
        Restores the session from a set of properties. __This method is invoked by
        the session either after the applciation starts up and session data was
        restored from the store__ or when properties in the store have changed due
        to external events (e.g. in another tab).

        __This method returns a promise. A resolving promise will result in the
        session being authenticated.__ Any properties the promise resolves with
        will be saved by and accessible via the session. In most cases the
        `properties` argument will simply be forwarded through the promise. A
        rejecting promise indicates that authentication failed and the session
        will remain unchanged.

        `Ember.SimpleAuth.Authenticators.Base`'s always rejects as there's no
        reasonable default implementation.

        @method restore
        @param {Object} data The data to restore the session from
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
      */
      restore: function(data) {
        return new Ember.RSVP.reject();
      },

      /**
        Authenticates the session with the specified `options`. These options vary
        depending on the actual authentication mechanism the authenticator
        implements (e.g. a set of credentials or a Facebook account id etc.). __The
        session will invoke this method when an action in the appliaction triggers
        authentication__ (see
        [Ember.SimpleAuth.AuthenticationControllerMixin.actions#authenticate](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticate)).

        __This method returns a promise. A resolving promise will result in the
        session being authenticated.__ Any properties the promise resolves with
        will be saved by and accessible via the session. A rejecting promise
        indicates that authentication failed and the session will remain unchanged.

        `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
        rejecting promise and thus never authenticates the session as there's no
        reasonable default behavior (for Ember.SimpleAuth's default authenticator
        see
        [Ember.SimpleAuth.Authenticators.OAuth2](#Ember-SimpleAuth-Authenticators-OAuth2)).

        @method authenticate
        @param {Object} options The options to authenticate the session with
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
      */
      authenticate: function(options) {
        return new Ember.RSVP.reject();
      },

      /**
        Invalidation callback that is invoked when the session is invalidated.
        While the session will invalidate itself and clear all session properties,
        it might be necessary for some authenticators to perform additional tasks
        (e.g. invalidating an access token on the server), which should be done in
        this method.

        __This method returns a promise. A resolving promise will result in the
        session being invalidated.__ A rejecting promise will result in the session
        invalidation being intercepted and the session being left authenticated.

        `Ember.SimpleAuth.Authenticators.Base`'s implementation always returns a
        resolving promise and thus never intercepts session invalidation.

        @method invalidate
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being invalidated
      */
      invalidate: function() {
        return new Ember.RSVP.resolve();
      }
    });

    __exports__.Base = Base;
  });
define("ember-simple-auth/authenticators/oauth2", 
  ["./base","../utils/is_secure_url","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var isSecureUrl = __dependency2__.isSecureUrl;

    /**
      Authenticator that conforms to OAuth 2
      ([RFC 6749](http://tools.ietf.org/html/rfc6749)), specifically the _"Resource
      Owner Password Credentials Grant Type"_.

      This authenticator supports refreshing the access token automatically and
      will trigger the `'ember-simple-auth:session-updated'` event each time the
      token was refreshed.

      @class OAuth2
      @namespace Authenticators
      @extends Authenticators.Base
    */
    var OAuth2 = Base.extend({
      /**
        The endpoint on the server the authenticator acquires the access token
        from.

        @property serverTokenEndpoint
        @type String
        @default '/token'
      */
      serverTokenEndpoint: '/token',
      /**
        Sets whether the authenticator automatically refreshes access tokens.

        @property refreshAccessTokens
        @type Boolean
        @default true
      */
      refreshAccessTokens: true,
      /**
        @property _refreshTokenTimeout
        @private
      */
      _refreshTokenTimeout: null,

      /**
        Restores the session from a set of session properties; __will return a
        resolving promise when there's a non-empty `access_token` in the `data`__
        and a rejecting promise otherwise.

        This method also schedules automatic token refreshing when there are values
        for `refresh_token` and `expires_in` in the `data` and automatic token
        refreshing is not disabled (see
        [Ember.SimpleAuth.Authenticators.OAuth2#refreshAccessTokens](#Ember-SimpleAuth-Authenticators-OAuth2-refreshAccessTokens)).

        @method restore
        @param {Object} data The data to restore the session from
        @return {Ember.RSVP.Promise} A promise that when it resolves results in the session being authenticated
      */
      restore: function(data) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          if (!Ember.isEmpty(data.access_token)) {
            var now = (new Date()).getTime();
            if (!Ember.isEmpty(data.expires_at) && data.expires_at < now) {
              reject();
            } else {
              _this.scheduleAccessTokenRefresh(data.expires_in, data.expires_at, data.refresh_token);
              resolve(data);
            }
          } else {
            reject();
          }
        });
      },

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
          var data = { grant_type: 'password', username: credentials.identification, password: credentials.password };
          _this.makeRequest(data).then(function(response) {
            Ember.run(function() {
              var expiresAt = _this.absolutizeExpirationTime(response.expires_in);
              _this.scheduleAccessTokenRefresh(response.expires_in, expiresAt, response.refresh_token);
              resolve(Ember.$.extend(response, { expires_at: expiresAt }));
            });
          }, function(xhr, status, error) {
            Ember.run(function() {
              reject(xhr.responseJSON || xhr.responseText);
            });
          });
        });
      },

      /**
        Cancels any outstanding automatic token refreshes.

        @method invalidate
        @return {Ember.RSVP.Promise} A resolving promise
      */
      invalidate: function() {
        Ember.run.cancel(this._refreshTokenTimeout);
        delete this._refreshTokenTimeout;
        return new Ember.RSVP.resolve();
      },

      /**
        Sends an `AJAX` request to the `serverTokenEndpoint`. This will always be a
        _"POST_" request with content type _"application/x-www-form-urlencoded"_ as
        specified in [RFC 6749](http://tools.ietf.org/html/rfc6749).

        This method is not meant to be used directly but serves as an extension
        point to e.g. add _"Client Credentials"_ (see
        [RFC 6749, section 2.3](http://tools.ietf.org/html/rfc6749#section-2.3)).

        @method makeRequest
        @param {Object} data The data to send with the request, e.g. username and password or the refresh token
        @return {Deferred object} A Deferred object (see [the jQuery docs](http://api.jquery.com/category/deferred-object/)) that is compatible to Ember.RSVP.Promise; will resolve if the request succeeds, reject otherwise
        @protected
      */
      makeRequest: function(data) {
        if (!isSecureUrl(this.serverTokenEndpoint)) {
          Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
        }
        return Ember.$.ajax({
          url:         this.serverTokenEndpoint,
          type:        'POST',
          data:        data,
          dataType:    'json',
          contentType: 'application/x-www-form-urlencoded'
        });
      },

      /**
        @method scheduleAccessTokenRefresh
        @private
      */
      scheduleAccessTokenRefresh: function(expiresIn, expiresAt, refreshToken) {
        var _this = this;
        if (this.refreshAccessTokens) {
          var now = (new Date()).getTime();
          if (Ember.isEmpty(expiresAt) && !Ember.isEmpty(expiresIn)) {
            expiresAt = new Date(now + (expiresIn - 5) * 1000).getTime();
          }
          if (!Ember.isEmpty(refreshToken) && !Ember.isEmpty(expiresAt) && expiresAt > now) {
            Ember.run.cancel(this._refreshTokenTimeout);
            delete this._refreshTokenTimeout;
            this._refreshTokenTimeout = Ember.run.later(this, this.refreshAccessToken, expiresIn, refreshToken, expiresAt - now);
          }
        }
      },

      /**
        @method refreshAccessToken
        @private
      */
      refreshAccessToken: function(expiresIn, refreshToken) {
        var _this = this;
        var data  = { grant_type: 'refresh_token', refresh_token: refreshToken };
        this.makeRequest(data).then(function(response) {
          Ember.run(function() {
            expiresIn     = response.expires_in || expiresIn;
            refreshToken  = response.refresh_token || refreshToken;
            var expiresAt = _this.absolutizeExpirationTime(expiresIn);
            _this.scheduleAccessTokenRefresh(expiresIn, null, refreshToken);
            _this.trigger('ember-simple-auth:session-updated', Ember.$.extend(response, { expires_in: expiresIn, expires_at: expiresAt, refresh_token: refreshToken }));
          });
        }, function(xhr, status, error) {
          Ember.Logger.warn('Access token could not be refreshed - server responded with ' + error + '.');
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

    __exports__.OAuth2 = OAuth2;
  });
define("ember-simple-auth/authorizers", 
  ["./authorizers/base","./authorizers/oauth2","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var OAuth2 = __dependency2__.OAuth2;

    var Authorizers = Ember.Namespace.create({
      Base:   Base,
      OAuth2: OAuth2
    });

    __exports__.Authorizers = Authorizers;
  });
define("ember-simple-auth/authorizers/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The base for all authorizers. __This serves as a starting point for
      implementing custom authorizers and must not be used directly.__

      __The authorizer preprocesses all XHR requests__ (expect ones to 3rd party
      origins, see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and makes
      sure they have the required data attached that allows the server to identify
      the user making the request. This data might be a specific header, data in
      the query part of the URL, cookies etc. __The authorizer has to fit the
      authenticator__ (see
      [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))
      as it usually relies on data that the authenticator retrieves during
      authentication and that it makes available through the session.

      @class Base
      @namespace Authorizers
      @extends Ember.Object
    */
    var Base = Ember.Object.extend({
      /**
        The session the authorizer gets the data it needs to authorize requests
        from (see [Ember.SimpleAuth.Session](#Ember-SimpleAuth-Session)).

        @property session
        @readOnly
        @type Ember.SimpleAuth.Session
        @default the session instance that is created during the Ember.js application's intialization
      */
      session: null,

      /**
        Authorizes an XHR request by adding some sort of secret information that
        allows the server to identify the user making the request (e.g. a token in
        the `Authorization` header or some other secret in the query string etc.).

        `Ember.SimpleAuth.Authorizers.Base`'s implementation does nothing as
        there's no reasonable default behavior (for Ember.SimpleAuth's default
        authorizer see
        [Ember.SimpleAuth.Authorizers.OAuth2](#Ember-SimpleAuth-Authorizers-OAuth2)).

        @method authorize
        @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
        @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
      */
      authorize: function(jqXHR, requestOptions) {
      }
    });

    __exports__.Base = Base;
  });
define("ember-simple-auth/authorizers/oauth2", 
  ["./base","../utils/is_secure_url","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var isSecureUrl = __dependency2__.isSecureUrl;

    /**
      Authorizer that conforms to OAuth 2
      ([RFC 6749](http://tools.ietf.org/html/rfc6749)) by sending a bearer token
      ([RFC 6749](http://tools.ietf.org/html/rfc6750)) in the request's
      `Authorization` header.

      @class OAuth2
      @namespace Authorizers
      @extends Authorizers.Base
    */
    var OAuth2 = Base.extend({
      /**
        Authorizes an XHR request by sending the `access_token` property from the
        session as a bearer token in the `Authorization` header:

        ```
        Authorization: Bearer <access_token>
        ```

        @method authorize
        @param {jqXHR} jqXHR The XHR request to authorize (see http://api.jquery.com/jQuery.ajax/#jqXHR)
        @param {Object} requestOptions The options as provided to the `$.ajax` method (see http://api.jquery.com/jQuery.ajaxPrefilter/)
      */
      authorize: function(jqXHR, requestOptions) {
        if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.access_token'))) {
          if (!isSecureUrl(requestOptions.url)) {
            Ember.Logger.warn('Credentials are transmitted via an insecure connection - use HTTPS to keep them secure.');
          }
          jqXHR.setRequestHeader('Authorization', 'Bearer ' + this.get('session.access_token'));
        }
      }
    });

    __exports__.OAuth2 = OAuth2;
  });
define("ember-simple-auth/core", 
  ["./session","./authenticators","./authorizers","./stores","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Session = __dependency1__.Session;
    var Authenticators = __dependency2__.Authenticators;
    var Authorizers = __dependency3__.Authorizers;
    var Stores = __dependency4__.Stores;

    function extractLocationOrigin(location) {
      if (Ember.typeOf(location) === 'string') {
        var link = document.createElement('a');
        link.href = location;
        //IE requires the following line when url is relative.
        //First assignment of relative url to link.href results in absolute url on link.href but link.hostname and other properties are not set
        //Second assignment of absolute url to link.href results in link.hostname and other properties being set as expected
        link.href = link.href;
        location = link;
      }
      var port = location.port;
      if (Ember.isEmpty(port)) {
        //need to include the port whether its actually present or not as some versions of IE will always set it
        port = location.protocol === 'http:' ? '80' : (location.protocol === 'https:' ? '443' : '');
      }
      return location.protocol + '//' + location.hostname + (port !== '' ? ':' + port : '');
    }

    var urlOrigins     = {};
    var documentOrigin = extractLocationOrigin(window.location);
    var crossOriginWhitelist;
    function shouldAuthorizeRequest(url) {
      var urlOrigin = urlOrigins[url] = urlOrigins[url] || extractLocationOrigin(url);
      return crossOriginWhitelist.indexOf(urlOrigin) > -1 || urlOrigin === documentOrigin;
    }

    /**
      Ember.SimpleAuth's configuration object.

      @class Configuration
      @namespace $mainModule
    */
    var Configuration = Ember.Namespace.create({
      /**
        The route to transition to for authentication; should be set through
        [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

        @property authenticationRoute
        @readOnly
        @static
        @type String
        @default 'login'
      */
      authenticationRoute: 'login',

      /**
        The route to transition to after successful authentication; should be set
        through [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

        @property routeAfterAuthentication
        @readOnly
        @static
        @type String
        @default 'index'
      */
      routeAfterAuthentication: 'index',

      /**
        @property applicationRootUrl
        @static
        @private
        @type String
      */
      applicationRootUrl: null,
    });

    /**
      Sets up Ember.SimpleAuth for the application; this method __should be invoked
      in a custom initializer__ like this:

      ```javascript
      Ember.Application.initializer({
        name: 'authentication',
        initialize: function(container, application) {
          Ember.SimpleAuth.setup(container, application);
        }
      });
      ```

      @method setup
      @namespace $mainModule
      @static
      @param {Container} container The Ember.js application's dependency injection container
      @param {Ember.Application} application The Ember.js application instance
      @param {Object} [options]
        @param {String} [options.authenticationRoute] route to transition to for authentication - defaults to `'login'`
        @param {String} [options.routeAfterAuthentication] route to transition to after successful authentication - defaults to `'index'`
        @param {Array[String]} [options.crossOriginWhitelist] Ember.SimpleAuth will never authorize requests going to a different origin than the one the Ember.js application was loaded from; to explicitely enable authorization for additional origins, whitelist those origins - defaults to `[]` _(beware that origins consist of protocol, host and port (port can be left out when it is 80 for HTTP or 443 for HTTPS))_
        @param {Object} [options.authorizer] The authorizer _class_ to use; must extend `Ember.SimpleAuth.Authorizers.Base` - defaults to `Ember.SimpleAuth.Authorizers.OAuth2`
        @param {Object} [options.store] The store _class_ to use; must extend `Ember.SimpleAuth.Stores.Base` - defaults to `Ember.SimpleAuth.Stores.LocalStorage`
    **/
    var setup = function(container, application, options) {
      options                                = options || {};
      Configuration.routeAfterAuthentication = options.routeAfterAuthentication || Configuration.routeAfterAuthentication;
      Configuration.authenticationRoute      = options.authenticationRoute || Configuration.authenticationRoute;
      Configuration.applicationRootUrl       = container.lookup('router:main').get('rootURL') || '/';
      crossOriginWhitelist                   = Ember.A(options.crossOriginWhitelist || []).map(function(origin) {
        return extractLocationOrigin(origin);
      });

      container.register('ember-simple-auth:authenticators:oauth2', Authenticators.OAuth2);

      var store      = (options.store || Stores.LocalStorage).create();
      var session    = Session.create({ store: store, container: container });
      var authorizer = (options.authorizer || Authorizers.OAuth2).create({ session: session });

      container.register('ember-simple-auth:session:current', session, { instantiate: false });
      Ember.A(['model', 'controller', 'view', 'route']).forEach(function(component) {
        container.injection(component, 'session', 'ember-simple-auth:session:current');
      });

      Ember.$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
        if (shouldAuthorizeRequest(options.url)) {
          authorizer.authorize(jqXHR, options);
        }
      });
    };

    __exports__.setup = setup;
    __exports__.Configuration = Configuration;
  });
define("ember-simple-auth/mixins/application_route_mixin", 
  ["./../core","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember  = global.Ember;

    var Configuration = __dependency1__.Configuration;

    /**
      The mixin for the application route. This defines actions to authenticate the
      session as well as to invalidate it. These actions can be used in all
      templates like this:

      ```handlebars
      {{#if session.isAuthenticated}}
        <a {{ action 'invalidateSession' }}>Logout</a>
      {{else}}
        <a {{ action 'authenticateSession' }}>Login</a>
      {{/if}}
      ```

      While this code works it is __preferrable to use the regular `link-to` helper
      for the _'login'_ link__ as that will add the `'active'` class to the link.
      For the _'logout'_ actions of course there is no route.

      ```handlebars
      {{#if session.isAuthenticated}}
        <a {{ action 'invalidateSession' }}>Logout</a>
      {{else}}
        {{#link-to 'login'}}Login{{/link-to}}
      {{/if}}
      ```

      This mixin also defines actions that are triggered whenever the session is
      successfully authenticated or invalidated and whenever authentication or
      invalidation fails.

      @class ApplicationRouteMixin
      @namespace $mainModule
      @extends Ember.Mixin
      @static
    */
    var ApplicationRouteMixin = Ember.Mixin.create({
      activate: function() {
        var _this = this;
        this._super();
        this.get('session').on('ember-simple-auth:session-authentication-succeeded', function() {
          _this.send('sessionAuthenticationSucceeded');
        });
        this.get('session').on('ember-simple-auth:session-authentication-failed', function(error) {
          _this.send('sessionAuthenticationFailed', error);
        });
        this.get('session').on('ember-simple-auth:session-invalidation-succeeded', function() {
          _this.send('sessionInvalidationSucceeded');
        });
        this.get('session').on('ember-simple-auth:session-invalidation-failed', function(error) {
          _this.send('sessionInvalidationFailed', error);
        });
      },

      actions: {
        /**
          This action triggers transition to the `authenticationRoute` specified in
          [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). It can be used in
          templates as shown above. It is also triggered automatically by
          [Ember.SimpleAuth.AuthenticatedRouteMixin](#Ember-SimpleAuth-AuthenticatedRouteMixin)
          whenever a route that requries authentication is accessed but the session
          is not currently authenticated.

          __For an application that works without an authentication route (e.g.
          because it opens a new window to handle authentication there), this is
          the method to override, e.g.:__

          ```javascript
          App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
            actions: {
              authenticateSession: function() {
                this.get('session').authenticate('app:authenticators:custom', {});
              }
            }
          });
          ```

          @method actions.authenticateSession
        */
        authenticateSession: function() {
          this.transitionTo(Configuration.authenticationRoute);
        },

        /**
          This action is triggered whenever the session is successfully
          authenticated. If there is a transition that was previously intercepted
          by
          [AuthenticatedRouteMixin#beforeModel](#Ember-SimpleAuth-AuthenticatedRouteMixin-beforeModel)
          it will retry that. If there is no such transition, this action
          transitions to the `routeAfterAuthentication` specified in
          [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup).

          @method actions.sessionAuthenticationSucceeded
        */
        sessionAuthenticationSucceeded: function() {
          var attemptedTransition = this.get('session.attemptedTransition');
          if (attemptedTransition) {
            attemptedTransition.retry();
            this.set('session.attemptedTransition', null);
          } else {
            this.transitionTo(Configuration.routeAfterAuthentication);
          }
        },

        /**
          This action is triggered whenever session authentication fails. The
          `error` argument is the error object that the promise the authenticator
          returns rejects with. (see
          [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).

          It can be overridden to display error messages etc.:

          ```javascript
          App.ApplicationRoute = Ember.Route.extend(Ember.SimpleAuth.ApplicationRouteMixin, {
            actions: {
              sessionAuthenticationFailed: function(error) {
                this.controllerFor('application').set('loginErrorMessage', error.message);
              }
            }
          });
          ```

          @method actions.sessionAuthenticationFailed
          @param {any} error The error the promise returned by the authenticator rejects with, see [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)
        */
        sessionAuthenticationFailed: function(error) {
        },

        /**
          This action invalidates the session (see
          [Ember.SimpleAuth.Session#invalidate](#Ember-SimpleAuth-Session-invalidate)).
          If invalidation succeeds, it reloads the application (see
          [Ember.SimpleAuth.ApplicationRouteMixin.sessionInvalidationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)).

          @method actions.invalidateSession
        */
        invalidateSession: function() {
          this.get('session').invalidate();
        },

        /**
          This action is invoked whenever the session is successfully invalidated.
          It reloads the Ember.js application by redirecting the browser to the
          application's root URL so that all in-memory data (such as Ember Data
          stores etc.) is cleared. The root URL is automatically retrieved from the
          Ember.js application's router (see
          http://emberjs.com/guides/routing/#toc_specifying-a-root-url).

          @method actions.sessionInvalidationSucceeded
        */
        sessionInvalidationSucceeded: function() {
          window.location.replace(Configuration.applicationRootUrl);
        },

        /**
          This action is invoked whenever session invalidation fails. This mainly
          serves as an extension point to add custom behavior and does nothing by
          default.

          @method actions.sessionInvalidationFailed
        */
        sessionInvalidationFailed: function(error) {
        },

        /**
          This action is invoked when an authorization error occurs (which is
          usually __when a server responds with HTTP status 401__). It invalidates
          the session and reloads the application (see
          [Ember.SimpleAuth.ApplicationRouteMixin.sessionInvalidationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionInvalidationSucceeded)).

          @method actions.authorizationFailed
        */
        authorizationFailed: function() {
          this.get('session').invalidate();
        },

        /**
          @method actions.error
          @private
        */
        error: function(reason) {
          if (reason.status === 401) {
            this.send('authorizationFailed');
          }
          return true;
        }
      }
    });

    __exports__.ApplicationRouteMixin = ApplicationRouteMixin;
  });
define("ember-simple-auth/mixins/authenticated_route_mixin", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The mixin for routes that require the session to be authenticated in order to
      be accessible. Including this mixin in a route automatically adds hooks that
      enforce the session to be authenticated and redirect to the
      `authenticationRoute` specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) if it is not.

      `Ember.SimpleAuth.AuthenticatedRouteMixin` performs the redirect in the
      `beforeModel` method so that in all methods executed after that the session
      is guaranteed to be authenticated. __If `beforeModel` is overridden, ensure
      that the custom implementation calls `this._super(transition)`__ so that the
      session enforcement code is actually executed.

      @class AuthenticatedRouteMixin
      @extends Ember.Mixin
      @static
    */
    var AuthenticatedRouteMixin = Ember.Mixin.create({
      /**
        This method implements the enforcement of the session being authenticated.
        If the session is not authenticated, the current transition will be aborted
        and a redirect will be triggered to the `authenticationRoute` specified in
        [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup). The method also saves
        the intercepted transition so that it can be retried after the session has
        been authenticated (see
        [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).

        @method beforeModel
        @param {Transition} transition The transition that lead to this route
      */
      beforeModel: function(transition) {
        if (!this.get('session.isAuthenticated')) {
          transition.abort();
          this.set('session.attemptedTransition', transition);
          transition.send('authenticateSession');
        }
      }
    });

    __exports__.AuthenticatedRouteMixin = AuthenticatedRouteMixin;
  });
define("ember-simple-auth/mixins/authentication_controller_mixin", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The mixin for the controller that handles the `authenticationRoute` specified
      in [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)). It provides the
      `authenticate` action that will authenticate the session with the configured
      [Ember.SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)
      when invoked.

      @class AuthenticationControllerMixin
      @extends Ember.Mixin
    */
    var AuthenticationControllerMixin = Ember.Mixin.create({
      /**
        The authenticator factory used to authenticate the session.

        @property authenticatorFactory
        @type String
        @default null
      */
      authenticatorFactory: null,

      actions: {
        /**
          This action will authenticate the session with the configured
          [Ember.SimpleAuth.AuthenticationControllerMixin#authenticatorFactory](#Ember-SimpleAuth-AuthenticationControllerMixin-authenticatorFactory)
          (see
          Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate)).

          If authentication succeeds, this method triggers the
          `sessionAuthenticationSucceeded` action (see
          [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationSucceeded](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationSucceeded)).
          If authentication fails it triggers the `sessionAuthenticationFailed`
          action (see
          [Ember.SimpleAuth.ApplicationRouteMixin#sessionAuthenticationFailed](#Ember-SimpleAuth-ApplicationRouteMixin-sessionAuthenticationFailed)).

          @method actions.authenticate
          @param {Object} options Any options the auhtenticator needs to authenticate the session
        */
        authenticate: function(options) {
          var _this = this;
          this.get('session').authenticate(this.get('authenticatorFactory'), options);
        }
      }
    });

    __exports__.AuthenticationControllerMixin = AuthenticationControllerMixin;
  });
define("ember-simple-auth/mixins/login_controller_mixin", 
  ["./authentication_controller_mixin","../authenticators/oauth2","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var AuthenticationControllerMixin = __dependency1__.AuthenticationControllerMixin;
    var OAuth2 = __dependency2__.OAuth2;

    /**
      A mixin to use with the controller that handles the `authenticationRoute`
      specified in
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup) if the used authentication
      mechanism works with a login form that asks for user credentials. It provides
      the `authenticate` action that will authenticate the session with the
      configured authenticator factory when invoked. __This is a
      specialization of
      [Ember.SimpleAuth.AuthenticationControllerMixin](#Ember-SimpleAuth-AuthenticationControllerMixin).__

      Accompanying the controller that this mixin is mixed in the application needs
      to have a `login` template with the fields `identification` and `password` as
      well as an actionable button or link that triggers the `authenticate` action,
      e.g.:

      ```handlebars
      <form {{action 'authenticate' on='submit'}}>
        <label for="identification">Login</label>
        {{input id='identification' placeholder='Enter Login' value=identification}}
        <label for="password">Password</label>
        {{input id='password' placeholder='Enter Password' type='password' value=password}}
        <button type="submit">Login</button>
      </form>
      ```

      @class LoginControllerMixin
      @extends Ember.SimpleAuth.AuthenticationControllerMixin
    */
    var LoginControllerMixin = Ember.Mixin.create(AuthenticationControllerMixin, {
      /**
        The authenticator factory used to authenticate the session.

        @property authenticatorFactory
        @type String
        @default 'ember-simple-auth:authenticators:oauth2'
      */
      authenticatorFactory: 'ember-simple-auth:authenticators:oauth2',

      actions: {
        /**
          This action will authenticate the session with the configured
          [Ember.SimpleAuth.LoginControllerMixin#authenticatorFactory](#Ember-SimpleAuth-LoginControllerMixin-authenticatorFactory)
          if both `identification` and `password` are non-empty. It passes both
          values to the authenticator.

          _The action also resets the `password` property so sensitive data does not
          stay in memory for longer than necessary._

          @method actions.authenticate
        */
        authenticate: function() {
          var data = this.getProperties('identification', 'password');
          if (!Ember.isEmpty(data.identification) && !Ember.isEmpty(data.password)) {
            this.set('password', null);
            this._super(data);
          }
        }
      }
    });

    __exports__.LoginControllerMixin = LoginControllerMixin;
  });
define("ember-simple-auth/session", 
  ["./utils/flat_objects_are_equal","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var flatObjectsAreEqual = __dependency1__.flatObjectsAreEqual;

    /**
      __The session provides access to the current authentication state as well as
      any data resolved by the authenticator__ (see
      [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).
      It is created when Ember.SimpleAuth is set up (see
      [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)) and __injected into all
      models, controllers, routes and views so that all parts of the application
      can always access the current authentication state and other data__,
      depending on the used authenticator (see
      [Ember.SimpleAuth.Authenticators.Base](#Ember-SimpleAuth-Authenticators-Base))).

      The session also provides methods to authenticate the user and to invalidate
      itself (see
      [Ember.SimpleAuth.Session#authenticate](#Ember-SimpleAuth-Session-authenticate),
      [Ember.SimpleAuth.Session#invaldiate](#Ember-SimpleAuth-Session-invaldiate)
      These methods are usually invoked through actions from routes or controllers.

      @class Session
      @extends Ember.ObjectProxy
      @uses Ember.Evented
    */
    var Session = Ember.ObjectProxy.extend(Ember.Evented, {
      /**
        The authenticator factory used to authenticate the session. This is only
        set when the session is currently authenticated.

        @property authenticatorFactory
        @type String
        @readOnly
        @default null
      */
      authenticatorFactory: null,
      /**
        The store used to persist session properties. This is assigned during
        Ember.SimpleAuth's setup and can be specified there
        (see [Ember.SimpleAuth.setup](#Ember-SimpleAuth-setup)).

        @property store
        @type Ember.SimpleAuth.Stores.Base
        @readOnly
        @default null
      */
      store: null,
      /**
        Returns whether the session is currently authenticated.

        @property isAuthenticated
        @type Boolean
        @readOnly
        @default false
      */
      isAuthenticated: false,
      /**
        @property attemptedTransition
        @private
      */
      attemptedTransition: null,
      /**
        @property content
        @private
      */
      content: {},

      /**
        @method init
        @private
      */
      init: function() {
        var _this = this;
        this.bindToStoreEvents();
        var restoredContent      = this.store.restore();
        var authenticatorFactory = restoredContent.authenticatorFactory;
        if (!!authenticatorFactory) {
          delete restoredContent.authenticatorFactory;
          this.container.lookup(authenticatorFactory).restore(restoredContent).then(function(content) {
            _this.setup(authenticatorFactory, content);
          }, function() {
            _this.store.clear();
          });
        } else {
          this.store.clear();
        }
      },

      /**
        Authentices the session with an `authenticator` and appropriate `options`.
        __This delegates the actual authentication work to the `authenticator`__
        and handles the returned promise accordingly (see
        [Ember.SimpleAuth.Authenticators.Base#authenticate](#Ember-SimpleAuth-Authenticators-Base-authenticate)).

        __This method returns a promise itself. A resolving promise indicates that
        the session was successfully authenticated__ while a rejecting promise
        indicates that authentication failed and the session remains
        unauthenticated.

        @method authenticate
        @param {String} authenticatorFactory The authenticator factory to use as it is registered with Ember's container, see [Ember's API docs](http://emberjs.com/api/classes/Ember.Application.html#method_register)
        @param {Object} options The options to pass to the authenticator; depending on the type of authenticator these might be a set of credentials, a Facebook OAuth Token, etc.
        @return {Ember.RSVP.Promise} A promise that resolves when the session was authenticated successfully
      */
      authenticate: function(authenticatorFactory, options) {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          _this.container.lookup(authenticatorFactory).authenticate(options).then(function(content) {
            _this.setup(authenticatorFactory, content, true);
            resolve();
          }, function(error) {
            _this.clear();
            _this.trigger('ember-simple-auth:session-authentication-failed', error);
            reject(error);
          });
        });
      },

      /**
        Invalidates the session with the authenticator it is currently
        authenticated with (see
        [Ember.SimpleAuth.Session#authenticatorFactory](#Ember-SimpleAuth-Session-authenticatorFactory)).
        __This invokes the authenticator's `invalidate` method and handles the
        returned promise accordingly__ (see
        [Ember.SimpleAuth.Authenticators.Base#invalidate](#Ember-SimpleAuth-Authenticators-Base-invalidate)).

        __This method returns a promise itself. A resolving promise indicates that
        the session was successfully invalidated__ while a rejecting promise
        indicates that the promise returned by the `authenticator` rejected and
        thus invalidation was cancelled. In that case the session remains
        authenticated.

        @method invalidate
        @return {Ember.RSVP.Promise} A promise that resolves when the session was invalidated successfully
      */
      invalidate: function() {
        var _this = this;
        return new Ember.RSVP.Promise(function(resolve, reject) {
          var authenticator = _this.container.lookup(_this.authenticatorFactory);
          authenticator.invalidate(_this.content).then(function() {
            authenticator.off('ember-simple-auth:session-updated');
            _this.clear(true);
            resolve();
          }, function(error) {
            _this.trigger('ember-simple-auth:session-invalidation-failed', error);
            reject(error);
          });
        });
      },

      /**
        @method setup
        @private
      */
      setup: function(authenticatorFactory, content, trigger) {
        trigger = !!trigger && !this.get('isAuthenticated');
        this.setProperties({
          isAuthenticated:      true,
          authenticatorFactory: authenticatorFactory,
          content:              content
        });
        this.bindToAuthenticatorEvents();
        var data = Ember.$.extend({ authenticatorFactory: authenticatorFactory }, this.content);
        if (!flatObjectsAreEqual(data, this.store.restore())) {
          this.store.clear();
          this.store.persist(data);
        }
        if (trigger) {
          this.trigger('ember-simple-auth:session-authentication-succeeded');
        }
      },

      /**
        @method clear
        @private
      */
      clear: function(trigger) {
        trigger = !!trigger && this.get('isAuthenticated');
        this.setProperties({
          isAuthenticated:      false,
          authenticatorFactory: null,
          content:              {}
        });
        this.store.clear();
        if (trigger) {
          this.trigger('ember-simple-auth:session-invalidation-succeeded');
        }
      },

      /**
        @method bindToAuthenticatorEvents
        @private
      */
      bindToAuthenticatorEvents: function() {
        var _this = this;
        var authenticator = this.container.lookup(this.authenticatorFactory);
        authenticator.off('ember-simple-auth:session-updated');
        authenticator.on('ember-simple-auth:session-updated', function(content) {
          _this.setup(_this.authenticatorFactory, content);
        });
      },

      /**
        @method bindToStoreEvents
        @private
      */
      bindToStoreEvents: function() {
        var _this = this;
        this.store.on('ember-simple-auth:session-updated', function(content) {
          var authenticatorFactory = content.authenticatorFactory;
          if (!!authenticatorFactory) {
            delete content.authenticatorFactory;
            _this.container.lookup(authenticatorFactory).restore(content).then(function(content) {
              _this.setup(authenticatorFactory, content, true);
            }, function() {
              _this.clear(true);
            });
          } else {
            _this.clear(true);
          }
        });
      }
    });

    __exports__.Session = Session;
  });
define("ember-simple-auth/stores", 
  ["./stores/base","./stores/cookie","./stores/local_storage","./stores/ephemeral","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var Cookie = __dependency2__.Cookie;
    var LocalStorage = __dependency3__.LocalStorage;
    var Ephemeral = __dependency4__.Ephemeral;

    var Stores = Ember.Namespace.create({
      Base:         Base,
      Cookie:       Cookie,
      LocalStorage: LocalStorage,
      Ephemeral:    Ephemeral
    });

    __exports__.Stores = Stores;
  });
define("ember-simple-auth/stores/base", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    /**
      The base for all store types. __This serves as a starting point for
      implementing custom stores and must not be used directly.__

      Stores may trigger the `'ember-simple-auth:session-updated'` event when
      any of the stored values change due to external actions (e.g. from another
      tab). The session listens to that event and will handle the changes
      accordingly. Whenever the event is triggered by the store, the session will
      forward all values as one object to its authenticator which might then
      invalidate the session (see
      [Ember.SimpleAuth.Authenticators.Base#restore](#Ember-SimpleAuth-Authenticators-Base-restore)).

      @class Base
      @namespace Stores
      @extends Ember.Object
      @uses Ember.Evented
    */
    var Base = Ember.Object.extend(Ember.Evented, {
      /**
        Persists the `data` in the store.

        `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
      },

      /**
        Restores all data currently saved in the store as one plain object.

        `Ember.SimpleAuth.Stores.Base`'s implementation always returns an empty
        plain Object.

        @method restore
        @return {Object} The data currently persisted in the store.
      */
      restore: function() {
        return {};
      },

      /**
        Clears the store.

        `Ember.SimpleAuth.Stores.Base`'s implementation does nothing.

        @method clear
      */
      clear: function() {
      }
    });

    __exports__.Base = Base;
  });
define("ember-simple-auth/stores/cookie", 
  ["./base","../utils/flat_objects_are_equal","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var flatObjectsAreEqual = __dependency2__.flatObjectsAreEqual;

    /**
      Store that saves its data in session cookies.

      __In order to keep multiple tabs/windows of your application in sync, this
      store has to periodically (every 500ms) check the cookies__ for changes as
      there are no events that notify of changes in cookies. The recommended
      alternative is
      [Ember.SimpleAuth.Stores.LocalStorage](#Ember-SimpleAuth-Stores-LocalStorage)
      that also persistently stores data but instead of cookies relies on the
      `localStorage` API and does not need to poll for external changes.

      This store will trigger the `'ember-simple-auth:session-updated'` event when
      any of its cookies is changed from another tab or window.

      @class Cookie
      @namespace Stores
      @extends Stores.Base
    */
    var Cookie = Base.extend({
      /**
        The prefix to use for the store's cookie names so they can be distinguished
        from other cookies.

        @property cookieNamePrefix
        @type String
        @default 'ember_simple_auth:'
      */
      cookieNamePrefix: 'ember_simple_auth:',
      /**
        @property _secureCookies
        @private
      */
      _secureCookies: window.location.protocol === 'https:',
      /**
        @property _syncDataTimeout
        @private
      */
      _syncDataTimeout: null,

      /**
        @method init
        @private
      */
      init: function() {
        this.syncData();
      },

      /**
        Persists the `data` in session cookies.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
        for (var property in data) {
          this.write(property, data[property], null);
        }
        this._lastData = this.restore();
      },

      /**
        Restores all data currently saved in the session cookies identified by the
        `cookieNamePrefix` as one plain object.

        @method restore
        @return {Object} All data currently persisted in the session cookies
      */
      restore: function() {
        var _this = this;
        var data  = {};
        this.knownCookies().forEach(function(cookie) {
          data[cookie] = _this.read(cookie);
        });
        return data;
      },

      /**
        Clears the store by deleting all session cookies prefixed with the
        `cookieNamePrefix`.

        @method clear
      */
      clear: function() {
        var _this = this;
        this.knownCookies().forEach(function(cookie) {
          _this.write(cookie, null, (new Date(0)).toGMTString());
        });
        this._lastData = null;
      },

      /**
        @method read
        @private
      */
      read: function(name) {
        var value = document.cookie.match(new RegExp(this.cookieNamePrefix + name + '=([^;]+)')) || [];
        return decodeURIComponent(value[1] || '');
      },

      /**
        @method write
        @private
      */
      write: function(name, value, expiration) {
        var expires = Ember.isEmpty(expiration) ? '' : '; expires=' + expiration;
        var secure  = !!this._secureCookies ? ';secure' : '';
        document.cookie = this.cookieNamePrefix + name + '=' + encodeURIComponent(value) + expires + secure;
      },

      /**
        @method knownCookies
        @private
      */
      knownCookies: function() {
        var _this = this;
        return Ember.A(document.cookie.split(/[=;\s]+/)).filter(function(element) {
          return new RegExp('^' + _this.cookieNamePrefix).test(element);
        }).map(function(cookie) {
          return cookie.replace(_this.cookieNamePrefix, '');
        });
      },

      /**
        @method syncData
        @private
      */
      syncData: function() {
        var data = this.restore();
        if (!flatObjectsAreEqual(data, this._lastData)) {
          this._lastData = data;
          this.trigger('ember-simple-auth:session-updated', data);
        }
        if (!Ember.testing) {
          Ember.run.cancel(this._syncDataTimeout);
          this._syncDataTimeout = Ember.run.later(this, this.syncData, 500);
        }
      }
    });

    __exports__.Cookie = Cookie;
  });
define("ember-simple-auth/stores/ephemeral", 
  ["./base","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;

    /**
      Store that saves its data in memory and thus __is not actually persistent__.
      This store is mainly useful for testing.

      @class Ephemeral
      @namespace Stores
      @extends Stores.Base
    */
    var Ephemeral = Base.extend({
      /**
        @method init
        @private
      */
      init: function() {
        this.clear();
      },

      /**
        Persists the `data`.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
        this._data = Ember.$.extend(data, this._data);
      },

      /**
        Restores all data currently saved as one plain object.

        @method restore
        @return {Object} All data currently persisted
      */
      restore: function() {
        return Ember.$.extend({}, this._data);
      },

      /**
        Clears the store.

        @method clear
      */
      clear: function() {
        delete this._data;
        this._data = {};
      }
    });

    __exports__.Ephemeral = Ephemeral;
  });
define("ember-simple-auth/stores/local_storage", 
  ["./base","../utils/flat_objects_are_equal","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var global = (typeof window !== 'undefined') ? window : {},
        Ember = global.Ember;

    var Base = __dependency1__.Base;
    var flatObjectsAreEqual = __dependency2__.flatObjectsAreEqual;

    /**
      Store that saves its data in the browser's `localStorage`.

      This store will trigger the `'ember-simple-auth:session-updated'` event when
      any of the keys it manages is changed from another tab or window.

      @class LocalStorage
      @namespace Stores
      @extends Stores.Base
    */
    var LocalStorage = Base.extend({
      /**
        The prefix to use for the store's keys so they can be distinguished from
        others.

        @property keyPrefix
        @type String
        @default 'ember_simple_auth:'
      */
      keyPrefix: 'ember_simple_auth:',

      /**
        @property _triggerChangeEventTimeout
        @private
      */
      _triggerChangeEventTimeout: null,

      /**
        @method init
        @private
      */
      init: function() {
        this.bindToStorageEvents();
      },

      /**
        Persists the `data` in the `localStorage`.

        @method persist
        @param {Object} data The data to persist
      */
      persist: function(data) {
        for (var property in data) {
          var key = this.buildStorageKey(property);
          localStorage.setItem(key, data[property]);
        }
        this._lastData = this.restore();
      },

      /**
        Restores all data currently saved in the `localStorage` identified by the
        `keyPrefix` as one plain object.

        @method restore
        @return {Object} All data currently persisted in the `localStorage`
      */
      restore: function() {
        var _this = this;
        var data = {};
        this.knownKeys().forEach(function(key) {
          var originalKey = key.replace(_this.keyPrefix, '');
          data[originalKey] = localStorage.getItem(key);
        });
        return data;
      },

      /**
        Clears the store by deleting all `localStorage` keys prefixed with the
        `keyPrefix`.

        @method clear
      */
      clear: function() {
        this.knownKeys().forEach(function(key) {
          localStorage.removeItem(key);
        });
        this._lastData = null;
      },

      /**
        @method buildStorageKey
        @private
      */
      buildStorageKey: function(property) {
        return this.keyPrefix + property;
      },

      /**
        @method knownKeys
        @private
      */
      knownKeys: function(callback) {
        var keys = Ember.A([]);
        for (var i = 0, l = localStorage.length; i < l; i++) {
          var key = localStorage.key(i);
          if (key.indexOf(this.keyPrefix) === 0) {
            keys.push(key);
          }
        }
        return keys;
      },

      /**
        @method bindToStorageEvents
        @private
      */
      bindToStorageEvents: function() {
        var _this = this;
        Ember.$(window).bind('storage', function(e) {
          var data = _this.restore();
          if (!flatObjectsAreEqual(data, _this._lastData)) {
            _this._lastData = data;
            Ember.run.cancel(_this._triggerChangeEventTimeout);
            _this._triggerChangeEventTimeout = Ember.run.next(_this, function() {
              this.trigger('ember-simple-auth:session-updated', data);
            });
          }
        });
      }
    });

    __exports__.LocalStorage = LocalStorage;
  });
define("ember-simple-auth/utils/flat_objects_are_equal", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var flatObjectsAreEqual = function(a, b) {
      function sortObject(object) {
        var array = [];
        for (var property in object) {
          array.push([property, object[property]]);
        }
        return array.sort(function(a, b) {
          if (a[0] < b[0]) {
            return -1;
          } else if (a[0] > b[0]) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      return JSON.stringify(sortObject(a)) === JSON.stringify(sortObject(b));
    };

    __exports__.flatObjectsAreEqual = flatObjectsAreEqual;
  });
define("ember-simple-auth/utils/is_secure_url", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var isSecureUrl = function(url) {
      var link  = document.createElement('a');
      link.href = location;
      link.href = link.href;
      return link.protocol == 'https:';
    };

    __exports__.isSecureUrl = isSecureUrl;
  });
global.Ember.SimpleAuth = requireModule('ember-simple-auth');
})((typeof global !== 'undefined') ? global : window);
