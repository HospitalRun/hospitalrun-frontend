/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},
r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
d)).finalize(b)}}});var s=e.algo={};return e}(Math);
(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();
(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function(){var h=CryptoJS,j=h.lib.WordArray;h.enc.Base64={stringify:function(b){var e=b.words,f=b.sigBytes,c=this._map;b.clamp();b=[];for(var a=0;a<f;a+=3)for(var d=(e[a>>>2]>>>24-8*(a%4)&255)<<16|(e[a+1>>>2]>>>24-8*((a+1)%4)&255)<<8|e[a+2>>>2]>>>24-8*((a+2)%4)&255,g=0;4>g&&a+0.75*g<f;g++)b.push(c.charAt(d>>>6*(3-g)&63));if(e=c.charAt(64))for(;b.length%4;)b.push(e);return b.join("")},parse:function(b){var e=b.length,f=this._map,c=f.charAt(64);c&&(c=b.indexOf(c),-1!=c&&(e=c));for(var c=[],a=0,d=0;d<
e;d++)if(d%4){var g=f.indexOf(b.charAt(d-1))<<2*(d%4),h=f.indexOf(b.charAt(d))>>>6-2*(d%4);c[a>>>2]|=(g|h)<<24-8*(a%4);a++}return j.create(c,a)},_map:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="}})();

/*! url - v1.8.6 - 2013-11-22 */window.url=function(){function a(a){return!isNaN(parseFloat(a))&&isFinite(a)}return function(b,c){var d=c||window.location.toString();if(!b)return d;b=b.toString(),"//"===d.substring(0,2)?d="http:"+d:1===d.split("://").length&&(d="http://"+d),c=d.split("/");var e={auth:""},f=c[2].split("@");1===f.length?f=f[0].split(":"):(e.auth=f[0],f=f[1].split(":")),e.protocol=c[0],e.hostname=f[0],e.port=f[1]||("https"===e.protocol.split(":")[0].toLowerCase()?"443":"80"),e.pathname=(c.length>3?"/":"")+c.slice(3,c.length).join("/").split("?")[0].split("#")[0];var g=e.pathname;"/"===g.charAt(g.length-1)&&(g=g.substring(0,g.length-1));var h=e.hostname,i=h.split("."),j=g.split("/");if("hostname"===b)return h;if("domain"===b)return/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(h)?h:i.slice(-2).join(".");if("sub"===b)return i.slice(0,i.length-2).join(".");if("port"===b)return e.port;if("protocol"===b)return e.protocol.split(":")[0];if("auth"===b)return e.auth;if("user"===b)return e.auth.split(":")[0];if("pass"===b)return e.auth.split(":")[1]||"";if("path"===b)return e.pathname;if("."===b.charAt(0)){if(b=b.substring(1),a(b))return b=parseInt(b,10),i[0>b?i.length+b:b-1]||""}else{if(a(b))return b=parseInt(b,10),j[0>b?j.length+b:b]||"";if("file"===b)return j.slice(-1)[0];if("filename"===b)return j.slice(-1)[0].split(".")[0];if("fileext"===b)return j.slice(-1)[0].split(".")[1]||"";if("?"===b.charAt(0)||"#"===b.charAt(0)){var k=d,l=null;if("?"===b.charAt(0)?k=(k.split("?")[1]||"").split("#")[0]:"#"===b.charAt(0)&&(k=k.split("#")[1]||""),!b.charAt(1))return k;b=b.substring(1),k=k.split("&");for(var m=0,n=k.length;n>m;m++)if(l=k[m].split("="),l[0]===b)return l[1]||"";return null}}return""}}(),"undefined"!=typeof jQuery&&jQuery.extend({url:function(a,b){return window.url(a,b)}});
;(function() {
	'use strict';

	// In node there is no global Window object
	var isNode = (typeof window === 'undefined');

	function OAuthSignature() {
	}

	OAuthSignature.prototype.generate = function (httpMethod, url, parameters, consumerSecret, tokenSecret, options) {
		var signatureBaseString = new SignatureBaseString(httpMethod, url, parameters).generate();
		var encodeSignature = true;
		if (options) {
			encodeSignature = options.encodeSignature;
		}
		return new HmacSha1Signature(signatureBaseString, consumerSecret, tokenSecret).generate(encodeSignature);
	};

	// Specification: http://oauth.net/core/1.0/#anchor14
	// url: if the scheme is missing, http will be added automatically
	function SignatureBaseString(httpMethod, url, parameters) {
		parameters = new ParametersLoader(parameters).get();
		this._httpMethod = new HttpMethodElement(httpMethod).get();
		this._url = new UrlElement(url).get();
		this._parameters = new ParametersElement(parameters).get();
		this._rfc3986 = new Rfc3986();
	}

	SignatureBaseString.prototype = {
		generate : function () {
			// HTTP_METHOD & url & parameters
			return this._rfc3986.encode(this._httpMethod) + '&'
				+ this._rfc3986.encode(this._url) + '&'
				+ this._rfc3986.encode(this._parameters);
		}
	};

	function HttpMethodElement(httpMethod) {
		this._httpMethod = httpMethod || '';
	}

	HttpMethodElement.prototype = {
		get : function () {
			return this._httpMethod.toUpperCase();
		}
	};

	function UrlElement(url) {
		this._url = url || '';
	}

	UrlElement.prototype = {
		get : function () {
			// The following is to prevent js-url from loading the window.location
			if (!this._url) {
				return this._url;
			}

			// FIXME: Make this behaviour explicit by returning warnings
			if (this._url.indexOf('://') == -1) {
				this._url = 'http://' + this._url;
			}

			// Handle parsing the url in node or in browser
			var parsedUrl = isNode ? this.parseInNode() : this.parseInBrowser(),
				// FIXME: Make this behaviour explicit by returning warnings
				scheme = (parsedUrl.scheme || 'http').toLowerCase(),
				// FIXME: Make this behaviour explicit by returning warnings
				authority = (parsedUrl.authority || '').toLocaleLowerCase(),
				path = parsedUrl.path || '',
				port = parsedUrl.port || '';

			// FIXME: Make this behaviour explicit by returning warnings
			if ((port == 80 && scheme == 'http')
				|| (port == 443 && scheme == 'https'))
			{
				port = '';
			}
			var baseUrl = scheme + '://' + authority;
			baseUrl = baseUrl + (!!port ? ':' + port : '');
			// FIXME: Make this behaviour explicit by returning warnings
			if (path == '/' && this._url.indexOf(baseUrl + path) === -1) {
				path = '';
			}
			this._url =
				(scheme ? scheme + '://' : '')
					+ authority
					+ (port ? ':' + port : '')
					+ path;
			return this._url;
		},
		parseInBrowser : function () {
			return {
				scheme : url('protocol', this._url).toLowerCase(),
				authority : url('hostname', this._url).toLocaleLowerCase(),
				port : url('port', this._url),
				path :url('path', this._url)
			};
		},
		parseInNode : function () {
			var url = require('url'),
				parsedUri = url.parse(this._url),
				scheme = parsedUri.protocol;
			// strip the ':' at the end of the scheme added by the url module
			if (scheme.charAt(scheme.length - 1) == ":") {
				scheme = scheme.substring(0, scheme.length - 1);
			}
			return {
				scheme : scheme,
				authority : parsedUri.hostname,
				port : parsedUri.port,
				path : parsedUri.pathname
			};
		}
	};

	function ParametersElement (parameters) {
		// Parameters format: { 'key': ['value 1', 'value 2'] };
		this._parameters = parameters || {};
		this._sortedKeys = [];
		this._normalizedParameters = [];
		this._rfc3986 = new Rfc3986();
		this._sortParameters();
		this._concatenateParameters();
	}

	ParametersElement .prototype = {
		_sortParameters : function () {
			var key;
			for (key in this._parameters) {
				// FIXME: Add hasOwnProperty check
				this._sortedKeys.push(key);
			}
			this._sortedKeys.sort();
		},
		_concatenateParameters : function () {
			var i;
			for (i = 0; i < this._sortedKeys.length; i++) {
				this._normalizeParameter(this._sortedKeys[i]);
			}
		},
		_normalizeParameter : function (key) {
			var i,
				values = this._parameters[key],
				encodedKey = this._rfc3986.encode(key),
				encodedValue;
			values.sort();
			for (i = 0; i < values.length; i++) {
				encodedValue = this._rfc3986.encode(values[i]);
				this._normalizedParameters.push(encodedKey + '=' + encodedValue)
			}
		},
		get : function () {
			return this._normalizedParameters.join('&');
		}
	};

	function ParametersLoader (parameters) {
		// Format: { 'key': ['value 1', 'value 2'] }
		this._parameters = {};
		this._loadParameters(parameters || {});
	}

	ParametersLoader.prototype = {
		_loadParameters : function (parameters) {
			if (parameters instanceof Array) {
				this._loadParametersFromArray(parameters);
			} else if (typeof parameters === 'object') {
				this._loadParametersFromObject(parameters);
			}
		},
		_loadParametersFromArray : function (parameters) {
			var i;
			for (i = 0; i < parameters.length; i++) {
				this._loadParametersFromObject(parameters[i]);
			}
		},
		_loadParametersFromObject : function (parameters) {
			var key;
			for (key in parameters) {
				if (parameters.hasOwnProperty(key)) {
					this._loadParameterValue(key, parameters[key] || '');
				}
			}
		},
		_loadParameterValue : function (key, value) {
			var i;
			if (value instanceof Array) {
				for (i = 0; i < value.length; i++) {
					this._addParameter(key, value[i]);
				}
				if (value.length == 0) {
					this._addParameter(key, '');
				}
			} else {
				this._addParameter(key, value);
			}
		},
		_addParameter : function (key, value) {
			if (!this._parameters[key]) {
				this._parameters[key] = [];
			}
			this._parameters[key].push(value);
		},
		get : function () {
			return this._parameters;
		}
	};

	function Rfc3986() {

	}

	Rfc3986.prototype = {
		encode : function (decoded) {
			if (!decoded) {
				return '';
			}
			// using implementation from: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FencodeURIComponent
			return encodeURIComponent(decoded)
				.replace(/[!'()]/g, escape)
				.replace(/\*/g, "%2A");
		},
		decode : function (encoded) {
			if (!encoded) {
				return '';
			}
			return decodeURIComponent(encoded);
		}
	};

	function HmacSha1Signature(signatureBaseString, consumerSecret, tokenSecret) {
		this._rfc3986 = new Rfc3986();
		this._text = signatureBaseString;
		this._key = this._rfc3986.encode(consumerSecret) + '&' + this._rfc3986.encode(tokenSecret);
		this._base64EncodedHash = new HmacSha1(this._text, this._key).getBase64EncodedHash();
	}

	HmacSha1Signature.prototype = {
		generate : function (encode) {
			return encode === false ?
					this._base64EncodedHash :
					this._rfc3986.encode(this._base64EncodedHash);
		}
	};

	function HmacSha1(text, key) {
		// load CryptoJs in the browser or in node
		this._cryptoJS = isNode ? require('crypto-js') : CryptoJS;
		this._text = text || '';
		this._key = key || '';
		this._hash = this._cryptoJS.HmacSHA1(this._text, this._key);
	}

	HmacSha1.prototype = {
		getBase64EncodedHash : function () {
			return this._hash.toString(this._cryptoJS.enc.Base64);
		}
	};

	var oauthSignature = new OAuthSignature();
	oauthSignature.SignatureBaseString = SignatureBaseString;
	oauthSignature.HttpMethodElement = HttpMethodElement;
	oauthSignature.UrlElement = UrlElement;
	oauthSignature.ParametersElement = ParametersElement;
	oauthSignature.ParametersLoader = ParametersLoader;
	oauthSignature.Rfc3986 = Rfc3986;
	oauthSignature.HmacSha1Signature = HmacSha1Signature;
	oauthSignature.HmacSha1 = HmacSha1;

	// support for the browser and nodejs
	if (isNode) {
		module.exports = oauthSignature;
	} else {
		window.oauthSignature = oauthSignature;
	}
})();