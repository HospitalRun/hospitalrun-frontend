# OAuth 1.0a signature generator for node and the browser

[![Build Status](https://travis-ci.org/bettiolo/oauth-signature-js.png?branch=master)](https://travis-ci.org/bettiolo/oauth-signature-js)
[![NPM version](https://badge.fury.io/js/oauth-signature.png)](http://badge.fury.io/js/oauth-signature)
[![Dependency Status](https://david-dm.org/bettiolo/oauth-signature-js.png?theme=shields.io)](https://david-dm.org/bettiolo/oauth-signature-js)

[![NPM](https://nodei.co/npm/oauth-signature.png?mini=true)](https://nodei.co/npm/oauth-signature/)

## Installation

#### Install with `npm`:

```shell
npm install oauth-signature
```

#### Install with `bower`:

```shell
bower install oauth-signature
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/oauth-signature/dist/oauth-signature.js"></script>
```


## Usage

To generate the OAuth signature call the following method:

```js
oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, options)
```
- `tokenSecret` is optional
- `options` is optional

the default `options` parameter is as follows
```js
var options = {
	encodeSignature: true // will encode the signature following the RFC3986 Spec by default
}
```

## Example

The following is an example on how to generate the signature for the reference sample as defined in  
 - http://oauth.net/core/1.0a/#rfc.section.A.5.1 
 - http://oauth.net/core/1.0a/#rfc.section.A.5.2

```js
var httpMethod = 'GET',
	url = 'http://photos.example.net/photos',
	parameters = {
		oauth_consumer_key : 'dpf43f3p2l4k3l03',
		oauth_token : 'nnch734d00sl2jdk',
		oauth_nonce : 'kllo9940pd9333jh',
		oauth_timestamp : '1191242096',
		oauth_signature_method : 'HMAC-SHA1',
		oauth_version : '1.0',
		file : 'vacation.jpg',
		size : 'original'
	},
	consumerSecret = 'kd94hf93k423kf44',
	tokenSecret = 'pfkkdhi9sl3r4s00',
	// generates a RFC3986 encoded, BASE64 encoded HMAC-SHA1 hash
	encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret),
	// generates a BASE64 encode HMAC-SHA1 hash
	signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret, 
		{ encodeSignature: false}),
	;
```

The `encodedSignature` variable will contain the RFC3986 encoded, BASE64 encoded HMAC-SHA1 hash, ready to be used as a query parameter in a request: `tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D`.

The `signature` variable will contain the BASE64 HMAC-SHA1 hash, without encoding: `tR3+Ty81lMeYAr/Fid0kMTYa/WM=`.

## Requesting a protected resource

Use the generated signature to populate the `oauth_signature` parameter to sign a protected resource as per [RFC](http://oauth.net/core/1.0a/#rfc.section.A.5.3).

Example GET request using query string parameters:

http://photos.example.net/photos?file=vacation.jpg&size=original&oauth_consumer_key=dpf43f3p2l4k3l03&oauth_token=nnch734d00sl2jdk&oauth_signature_method=HMAC-SHA1&oauth_signature=tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D&oauth_timestamp=1191242096&oauth_nonce=kllo9940pd9333jh&oauth_version=1.0

## Advantages

This project has an extensive test coverage for all the corner cases present in the OAuth specification.

Take a look at the test file [src/app/signature.tests.mocha.js](src/app/oauth-signature.tests.mocha.js)

## How do I run tests?

The tests can be executed in your browser or in node

### Browser

Open the file [src/test-runner.mocha.html](src/test-runner.mocha.html) or [src/test-runner.qunit.html](src/test-runner.qunit.html) in your browser

You can also run them live: 
 - [src/test-runner.mocha.html](https://bettiolo.github.io/oauth-signature-js/src/test-runner.mocha.html)
 - [src/test-runner.qunit.html](https://bettiolo.github.io/oauth-signature-js/src/test-runner.qunit.html)

### Node

Execute `npm test` in the console

### Live example

If you want to make a working experiment you can use the live version of the OAuth signature page at this url: http://bettiolo.github.io/oauth-reference-page/

And you can hit the echo OAuth endpoints at this url: http://echo.lab.madgex.com/

- url: **http://echo.lab.madgex.com/echo.ashx**
- consumer key: **key**
- consumer secret: **secret**
- token: **accesskey**
- token secret: **accesssecret**
- nonce: **IMPORTANT!** generate a new one at EACH request otherwise you will get a 400 Bad Request
- timestamp: **IMPORTANT!** refresh the timestamp before each call
- fields: **add a field with name `foo` and value `bar`**

A url similar to this one will be generated: `http://echo.lab.madgex.com/echo.ashx?foo=bar&oauth_consumer_key=key&oauth_nonce=643377115&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1410807318&oauth_token=accesskey&oauth_version=1.0&oauth_signature=zCmKoF9rVlNxAkD8wUCizFUajs4%3D`

Click on the generated link on the right hand side and you will see the echo server returning `foo=bar`
